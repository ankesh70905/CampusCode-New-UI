import {
  demoAchievementRules,
  demoNotifications,
  demoProjects,
} from "../data/dashboardMockData.js";
import { demoEventRegistrations, eventCatalog } from "../data/eventsMockData.js";
import { getLocalDateKey } from "../utils/localDate.js";
import { deriveActivityFeed, getStreakSummary } from "./growthLogic.js";

export const DASHBOARD_STORAGE_KEY = "campuscode.dashboardState";
const LEGACY_PROFILE_KEY = "campuscode.demoProfile";
const STATE_VERSION = 3;
const QUALIFYING_ACTIVITY_TYPES = new Set(["project_update", "event_submission", "learning_session"]);
const PROJECT_MILESTONES = [
  ["idea", "Idea finalized"],
  ["research", "Research completed"],
  ["design", "Design completed"],
  ["development", "Development started"],
  ["prototype", "Prototype ready"],
  ["testing", "Testing completed"],
  ["deployed", "Project deployed"],
];

function readJson(storage, key) {
  const stored = storage.getItem(key);
  if (stored === null) return null;

  try {
    return JSON.parse(stored);
  } catch (error) {
    throw new Error(`Saved demo data for "${key}" is unreadable. Reset demo data to continue.`, { cause: error });
  }
}

function normalizeProfile(profile) {
  const visibility = profile?.visibility && typeof profile.visibility === "object" ? profile.visibility : {};
  return {
    name: typeof profile?.name === "string" && profile.name.trim() && profile.name.trim() !== "Demo Student"
      ? profile.name.trim()
      : "Student",
    email: typeof profile?.email === "string" ? profile.email : "",
    accountType: typeof profile?.accountType === "string" ? profile.accountType : "Student",
    institution: typeof profile?.institution === "string" ? profile.institution : "",
    skills: Array.isArray(profile?.skills) ? profile.skills.filter((skill) => typeof skill === "string") : [],
    visibility: {
      name: visibility.name !== false,
      institution: visibility.institution === true,
      skills: visibility.skills !== false,
      projects: visibility.projects !== false,
      achievements: visibility.achievements !== false,
      stats: visibility.stats !== false,
      recentActivity: visibility.recentActivity !== false,
    },
  };
}

function isRecordArray(value) {
  return Array.isArray(value) && value.every((record) => record && typeof record.id === "string");
}

function normalizeActivityRecords(records) {
  const seenDays = new Set();
  return records.filter((activity) => {
    if (!activity || typeof activity.localDate !== "string" || seenDays.has(activity.localDate)) return false;
    seenDays.add(activity.localDate);
    return true;
  });
}

function normalizeActivityLog(entries) {
  const seen = new Set();
  return entries.filter((entry) => {
    if (!entry || typeof entry.id !== "string" || seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  }).map((entry) => ({ ...entry, source: entry.source === "local" ? "local" : "sample" }));
}

function normalizeProject(project) {
  const milestones = Array.isArray(project.milestones) ? project.milestones : [];
  return {
    description: "",
    category: "Other",
    technologies: [],
    repositoryUrl: "",
    liveDemoUrl: "",
    visibility: "private",
    eventId: "",
    createdAt: project.updatedAt ?? new Date().toISOString(),
    history: [],
    ...project,
    milestones: PROJECT_MILESTONES.map(([id, title]) => {
      const milestone = milestones.find((item) => item?.id === id);
      return { id, title, completedAt: milestone?.completedAt ?? null };
    }),
    technologies: Array.isArray(project.technologies) ? [...new Set(project.technologies.filter((item) => typeof item === "string"))] : [],
    history: Array.isArray(project.history) ? project.history.filter((item) => item && typeof item.id === "string") : [],
  };
}

function isProject(value) {
  return Boolean(
    value &&
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.category === "string" &&
    Array.isArray(value.technologies) &&
    value.technologies.every((item) => typeof item === "string") &&
    typeof value.repositoryUrl === "string" &&
    typeof value.liveDemoUrl === "string" &&
    ["private", "public"].includes(value.visibility) &&
    ["draft", "in-progress", "paused", "completed", "submitted"].includes(value.status) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    (value.eventId === "" || eventCatalog.some((event) => event.id === value.eventId)) &&
    Array.isArray(value.milestones) &&
    value.milestones.length === PROJECT_MILESTONES.length &&
    new Set(value.milestones.map((item) => item?.id)).size === PROJECT_MILESTONES.length &&
    value.milestones.every((item) => item && typeof item.id === "string" && typeof item.title === "string" && (item.completedAt === null || typeof item.completedAt === "string")) &&
    Array.isArray(value.history)
  );
}

function isRegistration(value) {
  const memberValid = (member) => Boolean(
    member &&
    typeof member.id === "string" &&
    typeof member.name === "string" &&
    typeof member.role === "string" &&
    Array.isArray(member.skills) &&
    member.skills.every((skill) => typeof skill === "string")
  );
  const progressValid = value?.roundProgress &&
    typeof value.roundProgress === "object" &&
    !Array.isArray(value.roundProgress) &&
    Object.values(value.roundProgress).every((status) => ["locked", "upcoming", "active", "submitted", "under_review", "completed"].includes(status));
  const submissionValid = value?.submission &&
    typeof value.submission === "object" &&
    typeof value.submission.title === "string" &&
    typeof value.submission.description === "string" &&
    typeof value.submission.repositoryUrl === "string" &&
    typeof value.submission.liveDemoUrl === "string" &&
    typeof value.submission.reference === "string" &&
    typeof value.submission.roundId === "string" &&
    ["draft", "submitted", "under_review"].includes(value.submission.status);

  return Boolean(
    value &&
    typeof value.id === "string" &&
    typeof value.eventId === "string" &&
    typeof value.registeredAt === "string" &&
    ["registered", "completed", "cancelled"].includes(value.status) &&
    value.team &&
    typeof value.team.id === "string" &&
    typeof value.team.name === "string" &&
    typeof value.team.leader === "string" &&
    Array.isArray(value.team.members) &&
    value.team.members.every(memberValid) &&
    progressValid &&
    submissionValid &&
    Array.isArray(value.readAnnouncements) &&
    value.readAnnouncements.every((id) => typeof id === "string")
  );
}

export function createInitialDashboardState(profile = {}) {
  const state = {
    version: STATE_VERSION,
    profile: normalizeProfile(profile),
    projects: demoProjects.map(normalizeProject),
    activityRecords: [],
    activityLog: [
      ...demoProjects.map((project) => ({
        id: `sample-project-created-${project.id}`,
        type: "project_created",
        title: `Sample project started: ${project.title}`,
        entityId: project.id,
        occurredAt: project.createdAt,
        localDate: getLocalDateKey(new Date(project.createdAt)),
        source: "sample",
        isDemo: true,
      })),
      ...demoEventRegistrations.map((registration) => ({
        id: `sample-event-registered-${registration.id}`,
        type: "event_registered",
        title: `Sample registration: ${eventCatalog.find((event) => event.id === registration.eventId)?.title ?? "Event"}`,
        eventId: registration.eventId,
        occurredAt: registration.registeredAt,
        localDate: getLocalDateKey(new Date(registration.registeredAt)),
        source: "sample",
        isDemo: true,
      })),
    ],
    achievementUnlocks: [],
    streakMilestones: [],
    notifications: demoNotifications.map((notification) => ({ ...notification })),
    registrations: demoEventRegistrations.map((registration) => ({
      ...registration,
      team: { ...registration.team, members: registration.team.members.map((member) => ({ ...member, skills: [...member.skills] })) },
      roundProgress: { ...registration.roundProgress },
      submission: { ...registration.submission },
      readAnnouncements: [...registration.readAnnouncements],
    })),
    bookmarks: [],
    weeklyGoal: { target: 3 },
    settings: { deadlineReminders: true, projectReminders: true },
    updatedAt: new Date().toISOString(),
  };
  return addNewAchievementUnlocks(addNewStreakMilestones(state));
}

function hasDashboardCore(value, activityKey = "activityFeed") {
  return Boolean(
    value &&
    value.profile &&
    typeof value.profile === "object" &&
    !Array.isArray(value.profile) &&
    isRecordArray(value.projects) &&
    isRecordArray(value[activityKey]) &&
    isRecordArray(value.activityRecords) &&
    isRecordArray(value.notifications) &&
    Number.isInteger(value.weeklyGoal?.target) &&
    value.weeklyGoal.target > 0
  );
}

function isDashboardStateV1(value) {
  return value?.version === 1 && hasDashboardCore(value) && isRecordArray(value.events);
}

function hasRegistrationState(value) {
  return isRecordArray(value.registrations) &&
    value.registrations.every(isRegistration) &&
    new Set(value.registrations.map((registration) => registration.id)).size === value.registrations.length &&
    new Set(value.registrations.map((registration) => registration.eventId)).size === value.registrations.length &&
    value.registrations.every((registration) => eventCatalog.some((event) => event.id === registration.eventId)) &&
    Array.isArray(value.bookmarks) &&
    value.bookmarks.every((id) => typeof id === "string") &&
    new Set(value.bookmarks).size === value.bookmarks.length &&
    value.bookmarks.every((id) => eventCatalog.some((event) => event.id === id));
}

function isDashboardStateV2(value) {
  return value?.version === 2 &&
    hasDashboardCore(value) &&
    hasRegistrationState(value) &&
    (value.settings === undefined ||
      (value.settings && typeof value.settings === "object" && !Array.isArray(value.settings) &&
        typeof value.settings.deadlineReminders === "boolean" &&
        typeof value.settings.projectReminders === "boolean"));
}

function isDashboardState(value) {
  return Boolean(
    value?.version === STATE_VERSION &&
    hasDashboardCore(value, "activityLog") &&
    hasRegistrationState(value) &&
    value.projects.every(isProject) &&
    new Set(value.projects.map((project) => project.id)).size === value.projects.length &&
    new Set(value.projects.map((project) => project.title.trim().toLowerCase())).size === value.projects.length &&
    value.projects.every((project) => !project.eventId || value.registrations.some((registration) => registration.eventId === project.eventId)) &&
    new Set(value.activityRecords.map((activity) => activity.localDate)).size === value.activityRecords.length &&
    new Set(value.activityLog.map((activity) => activity.id)).size === value.activityLog.length &&
    isRecordArray(value.achievementUnlocks) &&
    value.achievementUnlocks.every((item) => demoAchievementRules.some((rule) => rule.id === item.achievementId) && typeof item.unlockedAt === "string") &&
    new Set(value.achievementUnlocks.map((item) => item.achievementId)).size === value.achievementUnlocks.length &&
    Array.isArray(value.streakMilestones) &&
    value.streakMilestones.every((item) => [3, 7, 14, 30, 60, 100].includes(item.days) && typeof item.achievedAt === "string") &&
    new Set(value.streakMilestones.map((item) => item.days)).size === value.streakMilestones.length &&
    (value.settings === undefined ||
      (value.settings &&
        typeof value.settings === "object" &&
        !Array.isArray(value.settings) &&
        typeof value.settings.deadlineReminders === "boolean" &&
        typeof value.settings.projectReminders === "boolean"))
  );
}

export function loadDashboardState(storage = window.localStorage) {
  const savedState = readJson(storage, DASHBOARD_STORAGE_KEY);
  const savedProfile = readJson(storage, LEGACY_PROFILE_KEY);

  if (savedState === null) return createInitialDashboardState(savedProfile ?? {});
  if (isDashboardStateV1(savedState)) {
    const { events: legacyEvents, activityFeed: legacyFeed, ...preservedState } = savedState;
    const registrationIds = new Set(legacyEvents.map((event) => event.id));
    const registrations = demoEventRegistrations
      .filter((registration) => registrationIds.has(registration.eventId))
      .map((registration) => {
        const previousEvent = legacyEvents.find((event) => event.id === registration.eventId);
        return previousEvent?.state === "completed" ? { ...registration, status: "completed" } : registration;
      });
    const migratedState = {
      ...preservedState,
      version: 3,
      profile: normalizeProfile({ ...savedProfile, ...savedState.profile }),
      registrations,
      bookmarks: [],
      settings: { deadlineReminders: true, projectReminders: true, ...savedState.settings },
      projects: savedState.projects.map(normalizeProject),
      activityRecords: normalizeActivityRecords(savedState.activityRecords),
      activityLog: normalizeActivityLog(legacyFeed).map((activity) => ({
        ...activity,
        source: activity.source === "local" ? "local" : "sample",
      })),
      achievementUnlocks: [],
      streakMilestones: [],
    };
    return saveDashboardState(storage, migratedState);
  }
  if (isDashboardStateV2(savedState)) {
    const { events: _legacyEvents, activityFeed, ...preservedState } = savedState;
    const migratedState = {
      ...preservedState,
      version: STATE_VERSION,
      profile: normalizeProfile({ ...savedProfile, ...savedState.profile }),
      projects: savedState.projects.map(normalizeProject),
      activityRecords: normalizeActivityRecords(savedState.activityRecords),
      activityLog: normalizeActivityLog(activityFeed).map((activity) => ({
        ...activity,
        source: activity.source === "local" ? "local" : "sample",
      })),
      achievementUnlocks: [],
      streakMilestones: [],
      settings: { deadlineReminders: true, projectReminders: true, ...savedState.settings },
    };
    return saveDashboardState(storage, migratedState);
  }
  if (!isDashboardState(savedState)) {
    throw new Error("Saved dashboard data has an unsupported format. Reset demo data to continue.");
  }

  const normalizedState = {
    ...savedState,
    profile: normalizeProfile({ ...savedProfile, ...savedState.profile }),
    projects: savedState.projects.map(normalizeProject),
    activityRecords: normalizeActivityRecords(savedState.activityRecords),
    settings: {
      deadlineReminders: true,
      projectReminders: true,
      ...savedState.settings,
    },
  };
  return normalizedState;
}

export function saveDashboardState(storage, state) {
  const withAwards = addNewAchievementUnlocks(addNewStreakMilestones(state));
  if (!isDashboardState(withAwards)) {
    throw new Error("Cannot save invalid dashboard demo data.");
  }
  const updatedState = { ...withAwards, updatedAt: new Date().toISOString() };
  storage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(updatedState));
  return updatedState;
}

export function resetDashboardState(storage = window.localStorage) {
  storage.removeItem(DASHBOARD_STORAGE_KEY);
  return loadDashboardState(storage);
}

export function recordQualifyingActivity(state, { id, type, title, entityId, log = true, occurredAt = new Date() }) {
  if (!id || !QUALIFYING_ACTIVITY_TYPES.has(type)) {
    throw new Error("Choose a supported, user-completed activity to update a demo streak.");
  }

  const localDate = getLocalDateKey(occurredAt);
  const recorded = !state.activityRecords.some((activity) => activity.localDate === localDate);
  const activity = { id: `${id}-${localDate}`, type, occurredAt: occurredAt.toISOString(), localDate, isDemo: true };
  const nextRecords = recorded ? [...state.activityRecords, activity] : state.activityRecords;

  return {
    state: {
      ...state,
      activityRecords: nextRecords,
      activityLog: log
        ? appendActivityLog(state, { id: `local-${id}-${localDate}`, type, title: title ?? "Completed a qualifying demo activity", entityId, occurredAt: activity.occurredAt, localDate, source: "local", isDemo: true })
        : state.activityLog,
    },
    recorded,
  };
}

export function appendActivityLog(state, entry) {
  const entries = Array.isArray(state.activityLog) ? state.activityLog : [];
  if (entries.some((activity) => activity.id === entry.id)) return entries;
  return [entry, ...entries];
}

export function getOverviewStats(state) {
  const earnedAchievements = deriveAchievements(state).filter((achievement) => achievement.earned);
  return {
    registeredEvents: state.registrations.filter((registration) => registration.status !== "cancelled").length,
    activeEvents: state.registrations.filter((registration) => getRegistrationStatus(registration) === "in-progress").length,
    completedEvents: state.registrations.filter((registration) => getRegistrationStatus(registration) === "completed").length,
    projectsCreated: state.projects.length,
    achievementsEarned: earnedAchievements.length,
  };
}

export function deriveAchievements(state) {
  const streak = getStreakSummary(state.activityRecords);
  const counts = {
    "activity-days": streak.totalActiveDays,
    registrations: state.registrations.filter((registration) => registration.status !== "cancelled").length,
    projects: state.projects.length,
    submissions: state.registrations.filter((registration) => registration.submission.status === "submitted" || registration.submission.status === "under_review").length +
      state.projects.filter((project) => project.status === "submitted" && project.eventId).length,
    "longest-streak": streak.longest,
    milestones: state.projects.reduce((sum, project) => sum + project.milestones.filter((milestone) => milestone.completedAt).length, 0),
    "team-events": state.registrations.filter((registration) => registration.status !== "cancelled" && registration.team.members.length > 1).length,
    "completed-events": state.registrations.filter((registration) => registration.status === "completed" || getRegistrationStatus(registration) === "completed").length,
  };
  return demoAchievementRules.map((rule) => {
    const progress = Math.min(rule.target, counts[rule.kind] ?? 0);
    const unlock = state.achievementUnlocks?.find((item) => item.achievementId === rule.id);
    const unlocked = progress >= rule.target || Boolean(unlock);
    return {
      ...rule,
      progress: unlocked ? Math.max(progress, rule.target) : progress,
      unlocked,
      earned: unlocked,
      status: unlocked ? "unlocked" : progress > 0 ? "in-progress" : "locked",
      unlockedAt: unlock?.unlockedAt ?? null,
      isSample: unlock?.isSample ?? false,
    };
  });
}

function addNewAchievementUnlocks(state) {
  if (!state?.projects || !state.registrations || !state.activityRecords) return state;
  const unlocks = [...(state.achievementUnlocks ?? [])];
  const known = new Set(unlocks.map((item) => item.achievementId));
  const isSampleState = state.projects.every((project) => project.isDemo === true) &&
    state.registrations.every((registration) => registration.isSample === true) &&
    state.activityRecords.length === 0 &&
    state.activityLog.every((activity) => activity.source !== "local");
  for (const achievement of deriveAchievements({ ...state, achievementUnlocks: unlocks })) {
    if (!achievement.unlocked || known.has(achievement.id)) continue;
    const occurredAt = getAchievementTimestamp(state, achievement.id) ?? new Date().toISOString();
    unlocks.push({
      id: `achievement-unlock-${achievement.id}`,
      achievementId: achievement.id,
      unlockedAt: occurredAt,
      isSample: isSampleState,
    });
    state = {
      ...state,
      activityLog: appendActivityLog(state, {
        id: `activity-achievement-${achievement.id}`,
        type: "achievement",
        title: `Unlocked ${achievement.title}`,
        occurredAt,
        source: isSampleState ? "sample" : "local",
        isDemo: true,
      }),
    };
    known.add(achievement.id);
  }
  return { ...state, achievementUnlocks: unlocks };
}

function getAchievementTimestamp(state, achievementId) {
  const earliest = (values) => values.filter(Boolean).sort((a, b) => new Date(a) - new Date(b))[0] ?? null;
  if (achievementId === "first-step") return earliest(state.activityRecords.map((activity) => activity.occurredAt));
  if (achievementId === "event-explorer") return earliest(state.registrations.filter((item) => item.status !== "cancelled").map((item) => item.registeredAt));
  if (achievementId === "builder") return earliest(state.projects.map((project) => project.createdAt));
  if (achievementId === "first-submission") return earliest(state.registrations.map((item) => item.submission.submittedAt));
  if (achievementId === "consistent-creator") return getStreakSummary(state.activityRecords).milestones.find((item) => item.days === 7)?.achievedAt ?? null;
  if (achievementId === "milestone-master") {
    const completed = state.projects.flatMap((project) => project.milestones.map((item) => item.completedAt)).filter(Boolean).sort((a, b) => new Date(a) - new Date(b));
    return completed[4] ?? null;
  }
  if (achievementId === "team-player") return earliest(state.registrations.filter((item) => item.team.members.length > 1).map((item) => item.registeredAt));
  if (achievementId === "challenge-finisher") return earliest(state.registrations.filter((item) => item.status === "completed" || getRegistrationStatus(item) === "completed").map((item) => item.result?.announcedAt ?? eventCatalog.find((event) => event.id === item.eventId)?.endsAt));
  return null;
}

function addNewStreakMilestones(state) {
  if (!Array.isArray(state?.activityRecords)) return state;
  const summary = getStreakSummary(state.activityRecords);
  const unlocked = [...(state.streakMilestones ?? [])];
  const known = new Set(unlocked.map((item) => item.days));
  for (const milestone of summary.milestones) {
    if (!milestone.unlocked || known.has(milestone.days)) continue;
    const achievedAt = milestone.achievedAt ?? new Date().toISOString();
    unlocked.push({ id: `streak-milestone-${milestone.days}`, days: milestone.days, achievedAt });
    state = {
      ...state,
      activityLog: appendActivityLog(state, {
        id: `activity-streak-milestone-${milestone.days}`,
        type: "streak_milestone",
        title: `Reached a ${milestone.days}-day activity streak`,
        occurredAt: achievedAt,
        localDate: getLocalDateKey(new Date(achievedAt)),
        source: "local",
        isDemo: true,
      }),
    };
    known.add(milestone.days);
  }
  return { ...state, streakMilestones: unlocked };
}

export { deriveActivityFeed, getStreakSummary } from "./growthLogic.js";

export function getRegistrationStatus(registration, now = new Date()) {
  if (registration.status === "cancelled") return "cancelled";
  const event = eventCatalog.find((item) => item.id === registration.eventId);
  if (!event) return "upcoming";
  if (event.endsAt && new Date(event.endsAt) < now) return "completed";
  if (event.startsAt && new Date(event.startsAt) <= now) return "in-progress";
  return "upcoming";
}

export function getCertificateRecords(state, now = new Date()) {
  const certificateByEvent = new Map();
  for (const registration of state.registrations) {
    const event = eventCatalog.find((item) => item.id === registration.eventId);
    if (!event || (registration.status !== "completed" && getRegistrationStatus(registration, now) !== "completed")) continue;
    if (!certificateByEvent.has(event.id)) {
      certificateByEvent.set(event.id, {
        id: `certificate-${registration.id}`,
        registrationId: registration.id,
        eventId: event.id,
        title: event.title,
        participantName: state.profile.name,
        issueDate: registration.result?.announcedAt ?? event.endsAt,
        type: "Sample participation",
        isDemo: true,
      });
    }
  }
  return [...certificateByEvent.values()];
}

export function getWeeklyActivity(activities, now = new Date()) {
  const days = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(now);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    const dateKey = getLocalDateKey(date);
    const count = activities.filter((activity) => activity.localDate === dateKey).length;
    days.push({ date: dateKey, count, active: count > 0 });
  }
  return days;
}

export function getVisibleNotifications(state) {
  return state.notifications.filter((notification) => (
    notification.kind === "event_deadline" ? state.settings.deadlineReminders
      : notification.kind === "project" ? state.settings.projectReminders
        : true
  ));
}
