import { useCallback, useMemo, useRef, useState } from "react";
import {
  Award,
  Bell,
  BookOpenCheck,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  FolderKanban,
  History,
  LayoutDashboard,
  Settings,
  UserRound,
} from "lucide-react";
import { Link, NavLink, Outlet, useOutletContext } from "react-router-dom";
import logo from "../assets/brand.js";
import ThemeToggle from "./ThemeToggle.jsx";
import {
  createInitialDashboardState,
  DASHBOARD_STORAGE_KEY,
  deriveAchievements,
  getVisibleNotifications,
  getWeeklyActivity,
  loadDashboardState,
  saveDashboardState,
} from "../state/dashboardState.js";

const navigation = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/app/events", label: "Discover Events", icon: CalendarDays },
  { to: "/app/my-events", label: "My Events", icon: ChartNoAxesColumnIncreasing },
  { to: "/app/projects", label: "My Projects", icon: FolderKanban },
  { to: "/app/activity", label: "Activity", icon: History },
  { to: "/app/achievements", label: "Achievements", icon: Award },
  { to: "/app/certificates", label: "Certificates", icon: BookOpenCheck },
  { to: "/app/profile", label: "Profile", icon: UserRound },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function useDashboard() {
  return useOutletContext();
}

function initials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "DS";
}

export default function DashboardLayout() {
  const pendingCelebration = useRef("");
  const [dashboard, setDashboard] = useState(() => {
    try {
      return { data: loadDashboardState(), error: "" };
    } catch (error) {
      return { data: null, error: error.message };
    }
  });
  const [toast, setToast] = useState("");

  const updateDashboard = useCallback((update) => {
    if (!dashboard.data) return false;
    const next = typeof update === "function" ? update(dashboard.data) : update;
    try {
      const saved = saveDashboardState(window.localStorage, next);
      const previousMilestones = new Set(dashboard.data.streakMilestones.map((milestone) => milestone.days));
      const reachedMilestone = saved.streakMilestones.find((milestone) => !previousMilestones.has(milestone.days));
      const previousAchievements = new Set(dashboard.data.achievementUnlocks.map((achievement) => achievement.achievementId));
      const reachedAchievement = saved.achievementUnlocks.find((achievement) => !previousAchievements.has(achievement.achievementId) && !achievement.isSample);
      const activityDate = new Date();
      const previousWeeklyCount = getWeeklyActivity(dashboard.data.activityRecords, activityDate).filter((day) => day.active).length;
      const currentWeeklyCount = getWeeklyActivity(saved.activityRecords, activityDate).filter((day) => day.active).length;
      const weeklyGoalReached = saved.activityRecords.length > dashboard.data.activityRecords.length &&
        previousWeeklyCount < dashboard.data.weeklyGoal.target &&
        currentWeeklyCount >= saved.weeklyGoal.target;
      const completedEvent = saved.registrations.find((registration) =>
        registration.status === "completed" &&
        !dashboard.data.registrations.some((previous) => previous.id === registration.id && previous.status === "completed"));
      if (reachedMilestone) pendingCelebration.current = `Streak milestone reached: ${reachedMilestone.days} days!`;
      else if (reachedAchievement) {
        const title = deriveAchievements(saved).find((achievement) => achievement.id === reachedAchievement.achievementId)?.title;
        pendingCelebration.current = `Achievement unlocked: ${title ?? "a new milestone"}.`;
      } else if (weeklyGoalReached) pendingCelebration.current = "Weekly activity goal reached. Nice work!";
      else if (completedEvent) pendingCelebration.current = "Event completed in this demo timeline.";
      setDashboard({ data: saved, error: "" });
      return true;
    } catch (error) {
      setDashboard((current) => ({ ...current, error: error.message }));
      return false;
    }
  }, [dashboard.data]);

  const resetDemo = useCallback(() => {
    if (!window.confirm("Reset local workspace data and profile to their sample state?")) return;
    try {
      window.localStorage.removeItem(DASHBOARD_STORAGE_KEY);
      window.localStorage.removeItem("campuscode.demoProfile");
      const fresh = createInitialDashboardState();
      const saved = saveDashboardState(window.localStorage, fresh);
      setDashboard({ data: saved, error: "" });
      setToast("Workspace reset on this device.");
    } catch (error) {
      setDashboard((current) => ({ ...current, error: error.message }));
    }
  }, []);

  const dismissToast = useCallback(() => setToast(""), []);
  const notify = useCallback((message) => {
    setToast(pendingCelebration.current || message);
    pendingCelebration.current = "";
  }, []);
  const outletContext = useMemo(
    () => ({ dashboard: dashboard.data, updateDashboard, resetDemo, notify }),
    [dashboard.data, updateDashboard, resetDemo, notify],
  );
  const unreadNotifications = dashboard.data ? getVisibleNotifications(dashboard.data).filter((item) => !item.read).length : 0;

  return (
    <div className="dashboard-app">
      <a className="dashboard-skip" href="#dashboard-main">Skip to dashboard content</a>
      <header className="dashboard-header">
        <div className="dashboard-header-top">
          <Link className="dashboard-brand" to="/" aria-label="CampusCode home">
            <img src={logo} alt="CampusCode Hackathon Arena" />
          </Link>
          <div className="dashboard-user">
            <div className="dashboard-user-copy">
              <strong>{dashboard.data?.profile.name ?? "Student"}</strong>
              <span>{dashboard.data?.profile.accountType ?? "Student"}</span>
            </div>
            <span className="dashboard-avatar" aria-hidden="true">{initials(dashboard.data?.profile.name ?? "Student")}</span>
          </div>
          <ThemeToggle />
        </div>
        <nav className="dashboard-nav" aria-label="Student dashboard">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `dashboard-nav-link${isActive ? " is-active" : ""}`}>
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
          <NavLink to="/app/notifications" className={({ isActive }) => `dashboard-nav-notifications${isActive ? " is-active" : ""}`} aria-label={`Notifications${unreadNotifications ? `, ${unreadNotifications} unread` : ""}`}>
            <Bell size={17} aria-hidden="true" />
            {!!unreadNotifications && <span className="notification-badge">{unreadNotifications}</span>}
          </NavLink>
        </nav>
      </header>

      <main id="dashboard-main" className="dashboard-main">
        {dashboard.error && (
          <div className="dashboard-storage-error" role="alert">
            <div><strong>Workspace data could not be loaded or saved.</strong><p>{dashboard.error}</p></div>
            <button type="button" className="dashboard-reset-button" onClick={resetDemo}>Reset workspace</button>
          </div>
        )}
        {dashboard.data
          ? <Outlet context={outletContext} />
          : <section className="dashboard-load-error"><span className="eyebrow">// LOCAL DATA NEEDS ATTENTION</span><h1>We couldn't open this workspace.</h1><p>Reset local workspace data to remove invalid sample data and start over.</p><button className="button button-purple" type="button" onClick={resetDemo}>Reset workspace</button></section>}
      </main>

      <footer className="dashboard-footer">
        <span>CampusCode / Student workspace</span>
        <span>Local demo data · not synced</span>
        <Link to="/">Back to CampusCode ↗</Link>
      </footer>
      {toast && (
        <div className="dashboard-toast" role="status">
          <span>{toast}</span><button type="button" onClick={dismissToast} aria-label="Dismiss notification">×</button>
        </div>
      )}
    </div>
  );
}
