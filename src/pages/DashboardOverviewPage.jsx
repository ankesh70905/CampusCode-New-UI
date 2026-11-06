import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpenCheck,
  CalendarDays,
  Check,
  CircleHelp,
  Clock3,
  Flame,
  FolderKanban,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { eventCatalog } from "../data/eventsMockData.js";
import {
  getOverviewStats,
  deriveAchievements,
  getCertificateRecords,
  getStreakSummary,
  getWeeklyActivity,
  recordQualifyingActivity,
} from "../state/dashboardState.js";
import { getLocalDateKey } from "../utils/localDate.js";
import { useState } from "react";
import { useDashboard } from "../components/DashboardLayout.jsx";
import { deriveActivityFeed, getMonthlyActivity } from "../state/growthLogic.js";

const dateFormatter = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" });
const shortDateFormatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" });
const weekdayFormatter = new Intl.DateTimeFormat(undefined, { weekday: "short" });

function StatTile({ label, value, note, icon: Icon, accent }) {
  return (
    <article className={`dashboard-stat${accent ? " dashboard-stat-accent" : ""}`}>
      <div className="dashboard-stat-top"><span>{label}</span><Icon size={17} aria-hidden="true" /></div>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

function StreakPanel({ dashboard, onQualifyingActivity }) {
  const now = new Date();
  const streak = getStreakSummary(dashboard.activityRecords, now);
  const week = getWeeklyActivity(dashboard.activityRecords, now);
  const completedThisWeek = week.filter((day) => day.active).length;
  const todayKey = getLocalDateKey(now);
  const completedToday = streak.activeDays.includes(todayKey);
  const dayFormatter = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" });

  return (
    <section className="dash-panel streak-panel">
      <div className="panel-heading">
        <div><span className="dash-eyebrow">PERSONAL PRACTICE / DEMO</span><h2>A little momentum.</h2></div>
        <span className="streak-icon"><Flame size={18} /></span>
      </div>
      <div className="streak-summary">
        <div className="streak-current"><strong>{streak.current}</strong><span>day streak</span></div>
        <div className="streak-longest"><span>LONGEST</span><strong>{streak.longest} days</strong></div>
        <div className="streak-longest"><span>ACTIVE DAYS</span><strong>{streak.totalActiveDays}</strong></div>
        <div className="streak-next"><Sparkles size={15} /><span>{streak.nextMilestone ? `${streak.nextMilestone - streak.current} days to your ${streak.nextMilestone}-day milestone` : "All listed milestones reached"}</span></div>
      </div>
      <div className="streak-milestones" aria-label="Streak milestones">{streak.milestones.map((milestone) => <span className={milestone.unlocked ? "is-unlocked" : ""} key={milestone.days}>{milestone.days}d{milestone.unlocked ? " ✓" : ""}</span>)}</div>
      <div className="week-activity" aria-label={`Weekly activity: ${completedThisWeek} of 7 days active`}>
        {week.map((day) => {
          const date = new Date(`${day.date}T12:00:00`);
          return (
            <div className="week-day" key={day.date} aria-label={`${weekdayFormatter.format(date)} ${dayFormatter.format(date)}${day.active ? ", activity recorded" : ", no activity"}`}>
              <span>{weekdayFormatter.format(date)}</span>
              <i className={day.active ? "is-done" : ""}>{day.active ? <Check size={13} /> : null}</i>
            </div>
          );
        })}
      </div>
      <div className="streak-bottom">
        <p>{completedThisWeek} of 7 days with a qualifying activity this week. A day counts only after a deliberate project update, event submission, or learning session.</p>
        <button className="streak-action" type="button" disabled={completedToday} onClick={onQualifyingActivity}>
          {completedToday ? "Today recorded" : "Record a learning session"} {!completedToday && <ArrowRight size={15} />}
        </button>
      </div>
      <span className="timezone-note"><CircleHelp size={12} /> Activity days use this device’s local calendar. Opening the dashboard does not add activity.</span>
    </section>
  );
}

function WeeklyActivityPanel({ dashboard }) {
  const days = getWeeklyActivity(dashboard.activityRecords);
  const count = days.filter((day) => day.active).length;
  const target = dashboard.weeklyGoal.target;
  const progress = Math.min(100, Math.round((count / target) * 100));
  const remaining = Math.max(0, target - count);

  return (
    <section className="dash-panel weekly-panel">
      <div className="panel-heading">
        <div><span className="dash-eyebrow">THIS WEEK / LOCAL ACTIVITY</span><h2>Your week, in view.</h2></div>
        <span className="weekly-total">{count}<small> / {target} goal</small></span>
      </div>
      <div className="goal-track" role="progressbar" aria-label="Weekly activity goal" aria-valuemin={0} aria-valuemax={target} aria-valuenow={Math.min(count, target)}>
        <span style={{ width: `${progress}%` }} />
      </div>
      <div className="activity-bars" aria-label={`Activity on ${count} of the last seven days`}>
        {days.map((day) => {
          const date = new Date(`${day.date}T12:00:00`);
          return (
            <div className="activity-bar-day" key={day.date} aria-label={`${weekdayFormatter.format(date)}: ${day.count} qualifying activities`}>
              <span className={day.active ? "activity-bar has-activity" : "activity-bar"} style={{ "--bar-height": day.active ? `${Math.min(100, 32 + day.count * 24)}%` : "9%" }} />
              <small>{weekdayFormatter.format(date)}</small>
            </div>
          );
        })}
      </div>
      <div className="weekly-caption"><span>{count} qualifying days</span><span>{remaining ? `${remaining} more to reach your goal` : "Weekly goal complete"}</span></div>
      <p className="panel-disclaimer">Illustrative goal. Totals come from activities you deliberately record in this browser.</p>
    </section>
  );
}

function ActivityCalendarPanel({ activities, activityLog }) {
  const now = new Date();
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1, 12));
  const [selectedDate, setSelectedDate] = useState(() => getLocalDateKey(now));
  const calendar = getMonthlyActivity(activityLog, month.getFullYear(), month.getMonth());
  const dayDetails = calendar.days.find((day) => day.key === selectedDate);
  const previousMonth = () => setMonth((value) => {
    const previous = new Date(value.getFullYear(), value.getMonth() - 1, 1, 12);
    setSelectedDate(getLocalDateKey(previous));
    return previous;
  });
  const nextMonth = () => setMonth((value) => {
    const next = new Date(value.getFullYear(), value.getMonth() + 1, 1, 12);
    setSelectedDate(getLocalDateKey(next));
    return next;
  });
  const currentMonth = month.getFullYear() === now.getFullYear() && month.getMonth() === now.getMonth();
  const monthLabel = month.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  const week = getWeeklyActivity(activities, now);
  const weekDays = week.filter((day) => day.active).length;

  return (
    <section className="dash-panel activity-calendar-panel">
      <div className="panel-heading"><div><span className="dash-eyebrow">LOCAL ACTIVITY / MONTHLY VIEW</span><h2>Show up, your way.</h2></div><span className="weekly-total">{calendar.activeDays}<small> active days</small></span></div>
      <div className="calendar-month-controls"><button type="button" className="goal-step-button" onClick={previousMonth} aria-label="Previous month">‹</button><strong>{monthLabel}</strong><button type="button" className="goal-step-button" onClick={nextMonth} disabled={currentMonth} aria-label="Next month">›</button></div>
      <div className="activity-calendar-weekdays" aria-hidden="true">{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <span key={day}>{day}</span>)}</div>
      <ol className="activity-calendar" aria-label={`Activity calendar for ${monthLabel}`}>
        {calendar.days.map((day) => <li key={day.key}>{day.inMonth ? <button type="button" className={`activity-calendar-day intensity-${day.intensity}${selectedDate === day.key ? " is-selected" : ""}`} onClick={() => setSelectedDate(day.key)} disabled={day.key > getLocalDateKey(now)} aria-label={`${day.label}: ${day.count} recorded activities`} aria-pressed={selectedDate === day.key} title={`${day.label}: ${day.count} activities`}>{day.day}</button> : <span aria-hidden="true" />}</li>)}
      </ol>
      <div className="calendar-legend"><span>No activity</span><i aria-hidden="true" /><i className="intensity-2" /><span>More activities</span></div>
      <div className="calendar-day-details" aria-live="polite"><strong>{dayDetails?.label ?? "Choose a day"}</strong>{dayDetails?.activities.length ? <ul>{dayDetails.activities.map((activity) => <li key={activity.id}>{activity.title}</li>)}</ul> : <p>No recorded activity on this date.</p>}</div>
      <p className="calendar-week-summary">This week: {weekDays} active days · {activities.length} total active days · monthly actions: {calendar.activityCount}</p>
      <p className="panel-disclaimer">Only actions recorded in this local demo appear here. Empty days are not inferred; activity dates use this device’s local calendar.</p>
    </section>
  );
}

function WeeklyGoalCard({ dashboard, updateDashboard, notify }) {
  const target = dashboard.weeklyGoal.target;
  const count = getWeeklyActivity(dashboard.activityRecords).filter((day) => day.active).length;
  const setTarget = (nextTarget) => {
    const bounded = Math.min(7, Math.max(1, nextTarget));
    if (bounded !== target && updateDashboard({ ...dashboard, weeklyGoal: { target: bounded } })) {
      notify("Weekly activity goal updated on this device.");
    }
  };
  return (
    <section className="dash-panel goal-card">
      <div className="panel-heading"><div><span className="dash-eyebrow">YOUR WEEKLY INTENTION</span><h2>A goal that fits.</h2></div><Link className="panel-link" to="/app/settings">Settings <ArrowUpRight size={14} /></Link></div>
      <div className="goal-card-content"><div><strong>{count}<span> / {target}</span></strong><small>qualifying days this week</small></div><div className="goal-card-controls"><button type="button" className="goal-step-button" disabled={target <= 1} aria-label="Reduce weekly activity goal" onClick={() => setTarget(target - 1)}>−</button><button type="button" className="goal-step-button" disabled={target >= 7} aria-label="Increase weekly activity goal" onClick={() => setTarget(target + 1)}>+</button></div></div>
      <div className="goal-track" role="progressbar" aria-label="Weekly activity goal" aria-valuemin={0} aria-valuemax={target} aria-valuenow={Math.min(count, target)}><span style={{ width: `${Math.min(100, Math.round((count / target) * 100))}%` }} /></div>
      <p className="panel-disclaimer">A flexible local goal, not a platform score.</p>
    </section>
  );
}

function QuickActions() {
  return (
    <section className="quick-actions-section">
      <div className="panel-heading"><div><span className="dash-eyebrow">PICK UP THE THREAD</span><h2>Quick actions</h2></div></div>
      <div className="quick-action-grid">
        <Link to="/app/events" className="quick-action quick-action-purple">
          <span className="quick-action-icon"><CalendarDays size={18} /></span><span><strong>Explore Events</strong><small>Find a new prompt</small></span><ArrowUpRight size={16} />
        </Link>
        <Link to="/app/projects" className="quick-action">
          <span className="quick-action-icon"><FolderKanban size={18} /></span><span><strong>Continue a project</strong><small>Pick up an idea</small></span><ArrowUpRight size={16} />
        </Link>
        <Link to="/app/my-events" className="quick-action">
          <span className="quick-action-icon"><Clock3 size={18} /></span><span><strong>View My Events</strong><small>See your timeline</small></span><ArrowUpRight size={16} />
        </Link>
        <Link to="/app/profile" className="quick-action">
          <span className="quick-action-icon"><Award size={18} /></span><span><strong>Update profile</strong><small>Add your details</small></span><ArrowUpRight size={16} />
        </Link>
      </div>
    </section>
  );
}

function GrowthSnapshot({ dashboard }) {
  const activeProjects = dashboard.projects.filter((project) => project.status === "in-progress");
  const achievements = deriveAchievements(dashboard).filter((achievement) => achievement.unlocked)
    .sort((a, b) => new Date(b.unlockedAt ?? 0) - new Date(a.unlockedAt ?? 0)).slice(0, 3);
  const certificates = getCertificateRecords(dashboard);
  return <section className="dash-panel growth-snapshot">
    <div className="panel-heading"><div><span className="dash-eyebrow">YOUR GROWTH / LOCAL</span><h2>Work worth returning to.</h2></div><Link className="panel-link" to="/app/profile">Profile <ArrowUpRight size={14} /></Link></div>
    <div className="growth-snapshot-columns">
      <div><span className="dash-eyebrow">ACTIVE PROJECTS</span>{activeProjects.length ? <ul>{activeProjects.slice(0, 3).map((project) => <li key={project.id}><Link to={`/app/projects/${project.id}`}>{project.title}<ArrowUpRight size={12} /></Link></li>)}</ul> : <p>No active projects yet.</p>}<Link className="text-action" to="/app/projects">Open project workspace</Link></div>
      <div><span className="dash-eyebrow">RECENT ACHIEVEMENTS</span>{achievements.length ? <ul>{achievements.map((achievement) => <li key={achievement.id}><Award size={13} />{achievement.title}</li>)}</ul> : <p>Your first badge follows a qualifying step.</p>}<Link className="text-action" to="/app/achievements">View achievements</Link></div>
      <div><span className="dash-eyebrow">CERTIFICATE PREVIEWS</span><strong className="growth-certificate-count">{certificates.length}</strong><p>Sample records only</p><Link className="text-action" to="/app/certificates">Browse collection</Link></div>
    </div>
  </section>;
}

function DeadlinesPanel({ dashboard }) {
  const deadlines = dashboard.registrations
    .filter((registration) => registration.status !== "cancelled")
    .map((registration) => {
      const event = eventCatalog.find((item) => item.id === registration.eventId);
      const round = event?.rounds.find((item) => item.id === registration.currentRoundId);
      return event ? {
        id: registration.id,
        title: `${event.title} — ${round?.name ?? "Event timeline"}`,
        date: round?.deadlineAt ?? event.registrationDeadline,
        eventId: event.id,
      } : null;
    })
    .filter((deadline) => deadline && new Date(deadline.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  return (
    <section className="dash-panel deadlines-panel">
      <div className="panel-heading">
        <div><span className="dash-eyebrow">DATES TO KEEP IN MIND</span><h2>Coming up</h2></div>
        <span className="sample-chip">SAMPLE</span>
      </div>
      {deadlines.length ? (
        <ul className="deadline-list">
          {deadlines.map((deadline) => (
            <li key={deadline.id}>
              <span className="deadline-date">{shortDateFormatter.format(new Date(deadline.date))}</span>
              <span className="deadline-copy"><strong>{deadline.title}</strong>              <small>Local demo timeline · not a live event</small></span>
              <ArrowUpRight size={15} />
            </li>
          ))}
        </ul>
      ) : <p className="panel-empty">No registered sample deadlines coming up.</p>}
      <Link to="/app/my-events" className="panel-link">View your event timeline <ArrowRight size={14} /></Link>
    </section>
  );
}

function RecentActivityPanel({ activities }) {
  const dateLabel = (iso) => {
    const date = new Date(iso);
    if (getLocalDateKey(date) === getLocalDateKey()) return "Today";
    return shortDateFormatter.format(date);
  };

  return (
    <section className="dash-panel recent-panel">
      <div className="panel-heading">
        <div><span className="dash-eyebrow">A LOCAL DEMO TIMELINE</span><h2>Recent activity</h2></div>
        <span className="sample-chip">EXAMPLES</span>
      </div>
      {activities.length ? (
        <ul className="recent-list">
          {activities.slice(0, 4).map((activity) => (
            <li key={activity.id}>
              <span className={`recent-mark recent-mark-${activity.type}`} aria-hidden="true"><Check size={13} /></span>
              <span className="recent-copy"><strong>{activity.title}</strong><small>{dateLabel(activity.occurredAt)} · {activity.source === "local" ? "Recorded on this device" : "Example activity"}</small></span>
            </li>
          ))}
        </ul>
      ) : <p className="panel-empty">No activity yet. A qualifying action will appear here.</p>}
    </section>
  );
}

export function DashboardOverviewPage() {
  const { dashboard, updateDashboard, notify } = useDashboard();
  const stats = getOverviewStats(dashboard);
  const date = dateFormatter.format(new Date());
  const firstName = dashboard.profile.name.split(/\s+/)[0] || "Student";

  const recordSession = () => {
    const { state: next, recorded } = recordQualifyingActivity(dashboard, {
      id: `learning-session-${getLocalDateKey()}`,
      type: "learning_session",
    });
    if (!recorded) {
      notify("You already recorded qualifying activity today.");
      return;
    }
    if (updateDashboard(next)) notify("Learning session recorded in this local demo.");
  };

  return (
    <div className="dashboard-overview">
      <div className="dashboard-welcome">
        <div>
          <span className="dash-eyebrow">{date.toUpperCase()} <span>·</span> YOUR OVERVIEW</span>
          <h1>Welcome back, {firstName}<span>.</span></h1>
          <p>Your next opportunity starts with one small step.</p>
        </div>
        <div className="welcome-demo-note"><span className="welcome-avatar">{dashboard.profile.name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "DS"}</span><span><strong>Local demo</strong><small>Your activity stays here</small></span></div>
      </div>

      <div className="dashboard-stat-grid">
        <StatTile label="Registered events" value={stats.registeredEvents} note="Sample / local records" icon={CalendarDays} />
        <StatTile label="Active events" value={stats.activeEvents} note="Illustrative timelines" icon={Clock3} accent />
        <StatTile label="Completed events" value={stats.completedEvents} note="Demo records" icon={Check} />
        <StatTile label="Projects created" value={stats.projectsCreated} note="Sample workspace items" icon={FolderKanban} />
        <StatTile label="Achievements" value={stats.achievementsEarned} note="Criteria-based examples" icon={Award} />
        <StatTile label="Certificates" value={stats.completedEvents} note="Sample previews only" icon={BookOpenCheck} />
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-primary-column">
          <StreakPanel dashboard={dashboard} onQualifyingActivity={recordSession} />
          <WeeklyActivityPanel dashboard={dashboard} />
          <WeeklyGoalCard dashboard={dashboard} updateDashboard={updateDashboard} notify={notify} />
          <ActivityCalendarPanel activities={dashboard.activityRecords} activityLog={deriveActivityFeed(dashboard)} />
          <GrowthSnapshot dashboard={dashboard} />
          <QuickActions />
        </div>
        <aside className="dashboard-secondary-column" aria-label="Your updates">
          <DeadlinesPanel dashboard={dashboard} />
          <RecentActivityPanel activities={deriveActivityFeed(dashboard).slice(0, 8)} />
          <div className="dashboard-trust-note"><CircleHelp size={16} /><p>Numbers and activity on this overview come from <strong>illustrative demo records</strong> or actions you record on this device. They are not platform-wide statistics.</p></div>
        </aside>
      </div>
    </div>
  );
}
