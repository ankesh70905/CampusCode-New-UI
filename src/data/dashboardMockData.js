function daysFromToday(offset) {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString();
}

export const demoProjects = [
  {
    id: "quiet-campus",
    title: "Quiet Campus Map",
    description: "A sample map concept for finding quiet places to study.",
    category: "Social impact",
    technologies: ["React", "CSS"],
    repositoryUrl: "",
    liveDemoUrl: "",
    visibility: "private",
    status: "in-progress",
    eventId: "campus-climate-jam",
    createdAt: daysFromToday(-12),
    updatedAt: daysFromToday(-1),
    milestones: [
      { id: "idea", title: "Idea finalized", completedAt: daysFromToday(-11) },
      { id: "research", title: "Research completed", completedAt: daysFromToday(-9) },
      { id: "design", title: "Design completed", completedAt: daysFromToday(-7) },
      { id: "development", title: "Development started", completedAt: daysFromToday(-5) },
      { id: "prototype", title: "Prototype ready", completedAt: null },
      { id: "testing", title: "Testing completed", completedAt: null },
      { id: "deployed", title: "Project deployed", completedAt: null },
    ],
    history: [],
    isDemo: true,
  },
  {
    id: "repair-first",
    title: "Repair-First Kit",
    description: "A sample guide to help campus communities repair and reuse everyday items.",
    category: "Community",
    technologies: ["Figma", "HTML"],
    repositoryUrl: "",
    liveDemoUrl: "",
    visibility: "private",
    status: "draft",
    eventId: "",
    createdAt: daysFromToday(-20),
    updatedAt: daysFromToday(-3),
    milestones: [
      { id: "idea", title: "Idea finalized", completedAt: daysFromToday(-18) },
      { id: "research", title: "Research completed", completedAt: null },
      { id: "design", title: "Design completed", completedAt: null },
      { id: "development", title: "Development started", completedAt: null },
      { id: "prototype", title: "Prototype ready", completedAt: null },
      { id: "testing", title: "Testing completed", completedAt: null },
      { id: "deployed", title: "Project deployed", completedAt: null },
    ],
    history: [],
    isDemo: true,
  },
];

export const demoActivityFeed = [
  {
    id: "sample-activity-1",
    type: "project",
    title: "Updated Quiet Campus Map",
    occurredAt: daysFromToday(-1),
    source: "sample",
    isDemo: true,
  },
  {
    id: "sample-activity-2",
    type: "event",
    title: "Joined Campus Climate Jam",
    occurredAt: daysFromToday(-2),
    source: "sample",
    isDemo: true,
  },
  {
    id: "sample-activity-3",
    type: "milestone",
    title: "Completed a sample reflection milestone",
    occurredAt: daysFromToday(-4),
    source: "sample",
    isDemo: true,
  },
];

export const demoNotifications = [
  {
    id: "deadline-campus-climate",
    kind: "event_deadline",
    title: "Campus Climate Jam: build sprint",
    message: "Illustrative deadline in two days.",
    occurredAt: daysFromToday(2),
    read: false,
    isDemo: true,
  },
  {
    id: "project-quiet-campus",
    kind: "project",
    title: "Your sample project is ready for another pass",
    message: "A gentle reminder from the local demo.",
    occurredAt: daysFromToday(-1),
    read: false,
    isDemo: true,
  },
  {
    id: "welcome-demo",
    kind: "general",
    title: "Welcome to your workspace",
    message: "These example notifications are stored only in this browser.",
    occurredAt: daysFromToday(-2),
    read: true,
    isDemo: true,
  },
];

export const demoAchievementRules = [
  { id: "first-step", title: "First Step", description: "Complete your first qualifying activity.", category: "Consistency", kind: "activity-days", target: 1 },
  { id: "event-explorer", title: "Event Explorer", description: "Join your first sample event.", category: "Participation", kind: "registrations", target: 1 },
  { id: "builder", title: "Builder", description: "Create your first project.", category: "Project building", kind: "projects", target: 1 },
  { id: "first-submission", title: "First Submission", description: "Submit a project to a sample event.", category: "Participation", kind: "submissions", target: 1 },
  { id: "consistent-creator", title: "Consistent Creator", description: "Reach a seven-day streak.", category: "Consistency", kind: "longest-streak", target: 7 },
  { id: "milestone-master", title: "Milestone Master", description: "Complete five project milestones.", category: "Project building", kind: "milestones", target: 5 },
  { id: "team-player", title: "Team Player", description: "Join a sample team event.", category: "Teamwork", kind: "team-events", target: 1 },
  { id: "challenge-finisher", title: "Challenge Finisher", description: "Complete a sample event.", category: "Completion", kind: "completed-events", target: 1 },
];
