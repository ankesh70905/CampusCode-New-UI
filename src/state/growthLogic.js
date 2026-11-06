import { getCalendarDayNumber, getLocalDateKey } from "../utils/localDate.js";
import { eventCatalog } from "../data/eventsMockData.js";

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

function validDateKey(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function getStreakSummary(activities, now = new Date()) {
  const activeDays = [...new Set(
    activities
      .filter((activity) => activity?.isDemo === true && validDateKey(activity.localDate))
      .map((activity) => activity.localDate),
  )].sort();
  const unlockedAt = new Map();
  let longest = 0;
  let run = 0;
  let previousDay = null;
  activeDays.forEach((date, index) => {
    if (previousDay && getCalendarDayNumber(date) - getCalendarDayNumber(previousDay) === 1) {
      run += 1;
    } else {
      run = 1;
    }
    longest = Math.max(longest, run);
    for (const milestone of STREAK_MILESTONES) {
      if (run === milestone && !unlockedAt.has(milestone)) unlockedAt.set(milestone, activeDays[index]);
    }
    previousDay = date;
  });

  const todayKey = getLocalDateKey(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getLocalDateKey(yesterday);
  const lastDay = activeDays.at(-1);
  let current = 0;
  if (lastDay === todayKey || lastDay === yesterdayKey) {
    current = 1;
    for (let index = activeDays.length - 1; index > 0; index -= 1) {
      if (getCalendarDayNumber(activeDays[index]) - getCalendarDayNumber(activeDays[index - 1]) !== 1) break;
      current += 1;
    }
  }

  const milestones = STREAK_MILESTONES.map((days) => ({
    days,
    unlocked: longest >= days,
    achievedAt: unlockedAt.get(days) ?? null,
  }));
  return {
    current,
    longest,
    totalActiveDays: activeDays.length,
    activeDays,
    milestones,
    nextMilestone: STREAK_MILESTONES.find((milestone) => milestone > current) ?? null,
  };
}

export function getMonthlyActivity(activities, year, month) {
  const firstDay = new Date(year, month, 1, 12);
  const start = new Date(year, month, 1 - firstDay.getDay(), 12);
  const lastDay = new Date(year, month + 1, 0, 12);
  const totalCells = Math.ceil((firstDay.getDay() + lastDay.getDate()) / 7) * 7;
  const counts = new Map();
  for (const activity of activities) {
    if (activity?.isDemo !== true || !validDateKey(activity.localDate)) continue;
    counts.set(activity.localDate, (counts.get(activity.localDate) ?? 0) + 1);
  }
  const days = Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = getLocalDateKey(date);
    const count = counts.get(key) ?? 0;
    return {
      key,
      day: date.getDate(),
      count,
      inMonth: date.getMonth() === month,
      intensity: count === 0 ? 0 : Math.min(4, count),
      label: date.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }),
      activities: activities.filter((activity) => activity?.isDemo === true && activity.localDate === key),
    };
  });
  const monthDays = days.filter((day) => day.inMonth);
  return {
    days,
    activeDays: monthDays.filter((day) => day.count > 0).length,
    activityCount: monthDays.reduce((total, day) => total + day.count, 0),
    month,
    year,
  };
}

export function deriveActivityFeed(state) {
  const entries = Array.isArray(state.activityLog) ? [...state.activityLog] : [];
  const entryIds = new Set(entries.map((activity) => activity.id));
  for (const registration of state.registrations ?? []) {
    const event = eventCatalog.find((item) => item.id === registration.eventId);
    if (!event || !(registration.status === "completed" || new Date(event.endsAt) < new Date())) continue;
    const id = `event-timeline-completed-${registration.id}`;
    if (entryIds.has(id)) continue;
    entries.push({
      id,
      type: "event_completed",
      title: `${registration.isSample ? "Sample event timeline completed" : "Event timeline completed"}: ${event.title}`,
      eventId: event.id,
      occurredAt: registration.result?.announcedAt ?? event.endsAt,
      source: registration.isSample ? "sample" : "local",
      isDemo: true,
    });
  }
  return [...entries]
    .map((activity) => ({
      ...activity,
      localDate: activity.localDate ?? getLocalDateKey(new Date(activity.occurredAt)),
    }))
    .sort((a, b) => new Date(b.occurredAt) - new Date(a.occurredAt));
}
