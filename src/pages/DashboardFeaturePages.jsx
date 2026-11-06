import { useEffect, useRef, useState } from "react";
import {
  Award,
  Bell,
  BookOpenCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleHelp,
  ExternalLink,
  FolderKanban,
  Github,
  History,
  Medal,
  Plus,
  Save,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eventCatalog } from "../data/eventsMockData.js";
import { appendActivityLog, deriveAchievements, getCertificateRecords, getVisibleNotifications, recordQualifyingActivity } from "../state/dashboardState.js";
import { deriveActivityFeed, getStreakSummary } from "../state/growthLogic.js";
import { getLocalDateKey } from "../utils/localDate.js";
import { useDashboard } from "../components/DashboardLayout.jsx";

function PageIntro({ eyebrow, title, description, icon: Icon }) {
  return (
    <header className="feature-page-intro">
      <div>
        <span className="dash-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {Icon && <span className="feature-page-icon"><Icon size={20} aria-hidden="true" /></span>}
    </header>
  );
}

function FeaturePanel({ children, className = "" }) {
  return <section className={`feature-panel ${className}`.trim()}>{children}</section>;
}

export function StudentProfilePage() {
  const { dashboard, updateDashboard, notify } = useDashboard();
  const [profile, setProfile] = useState(dashboard.profile);
  const [skill, setSkill] = useState("");
  const [error, setError] = useState("");
  const achievements = deriveAchievements(dashboard).filter((achievement) => achievement.unlocked);
  const streak = getStreakSummary(dashboard.activityRecords);
  const certificates = getCertificateRecords(dashboard);

  const saveProfile = (event) => {
    event.preventDefault();
    const name = profile.name.trim();
    if (!name) {
      setError("Enter your name to save this demo profile.");
      return;
    }
    if (updateDashboard({ ...dashboard, profile: { ...profile, name, institution: profile.institution.trim() } })) {
      setProfile((current) => ({ ...current, name, institution: current.institution.trim() }));
      setError("");
      notify("Profile saved on this device.");
    }
  };

  const addSkill = () => {
    const nextSkill = skill.trim();
    if (!nextSkill) return;
    if (profile.skills.some((item) => item.toLowerCase() === nextSkill.toLowerCase())) {
      setError("That skill is already in your profile.");
      return;
    }
    setProfile((current) => ({ ...current, skills: [...current.skills, nextSkill] }));
    setSkill("");
    setError("");
  };

  return (
    <div className="feature-page">
      <PageIntro eyebrow="YOUR LOCAL PROFILE" title="Make it yours." description="Edit the demo profile shown in this browser. Changes are not published or synced." icon={CircleHelp} />
      <form className="feature-form" onSubmit={saveProfile}>
        <FeaturePanel>
          <div className="feature-panel-heading"><div><span className="dash-eyebrow">ABOUT YOU</span><h2>Profile details</h2></div><span className="sample-chip">ON THIS DEVICE</span></div>
          <div className="feature-form-grid">
            <label className="feature-field"><span>Full name</span><input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} autoComplete="name" /></label>
            <label className="feature-field"><span>Account type</span><select value={profile.accountType} onChange={(event) => setProfile({ ...profile, accountType: event.target.value })}><option>Student</option><option>Educator</option><option>Independent</option></select></label>
            <label className="feature-field"><span>Email</span><input value={profile.email} readOnly aria-describedby="profile-email-note" /><small id="profile-email-note">Set during demo registration; not verified.</small></label>
            <label className="feature-field"><span>Institution <small>(optional)</small></span><input value={profile.institution} onChange={(event) => setProfile({ ...profile, institution: event.target.value })} autoComplete="organization" /></label>
          </div>
          <div className="feature-form-actions"><button className="button button-purple" type="submit"><Save size={15} /> Save profile</button>{error && <span className="feature-inline-error" role="alert">{error}</span>}</div>
        </FeaturePanel>
        <FeaturePanel>
          <div className="feature-panel-heading"><div><span className="dash-eyebrow">WHAT YOU LIKE TO BUILD</span><h2>Skills and interests</h2></div></div>
          <p className="feature-description">Add a few topics that represent what you want to explore. These stay in your local demo profile.</p>
          <div className="skill-editor">
            <label className="feature-field" htmlFor="skill-input"><span>Add a skill</span><input id="skill-input" value={skill} onChange={(event) => setSkill(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addSkill(); } }} placeholder="e.g. Product design" /></label>
            <button type="button" className="button button-outline" onClick={addSkill}><Plus size={15} /> Add skill</button>
          </div>
          <ul className="skill-list" aria-label="Profile skills">
            {profile.skills.map((item) => <li key={item}><span>{item}</span><button type="button" aria-label={`Remove ${item}`} onClick={() => setProfile((current) => ({ ...current, skills: current.skills.filter((value) => value !== item) }))}><X size={14} /></button></li>)}
            {!profile.skills.length && <li className="skill-empty">No skills added yet.</li>}
          </ul>
        </FeaturePanel>
        <FeaturePanel>
          <div className="feature-panel-heading"><div><span className="dash-eyebrow">PROFILE PREVIEW / LOCAL ONLY</span><h2>Choose what appears</h2></div><span className="sample-chip">NOT PUBLISHED</span></div>
          <p className="feature-description">These switches only change the preview below. No profile is published or shared.</p>
          <div className="profile-visibility-controls">{Object.entries({ name: "Name", institution: "Institution", skills: "Skills", projects: "Projects", achievements: "Achievements", stats: "Growth summary", recentActivity: "Recent activity" }).map(([key, label]) => <label className="preference-row" key={key}><span><strong>Show {label.toLowerCase()}</strong></span><input type="checkbox" checked={profile.visibility[key] !== false} onChange={(event) => setProfile((current) => ({ ...current, visibility: { ...current.visibility, [key]: event.target.checked } }))} /></label>)}</div>
          <div className="public-profile-preview"><span className="dash-eyebrow">PUBLIC-STYLE DEMO PREVIEW</span>{profile.visibility.name !== false && <h3>{profile.name || "Student name"}</h3>}{profile.visibility.institution && profile.institution && <p>{profile.institution}</p>}{profile.visibility.skills && <div className="skill-list">{profile.skills.map((item) => <span className="skill-preview-chip" key={item}>{item}</span>)}</div>}{profile.visibility.stats !== false && <div className="profile-growth-stats"><span>{streak.current}<small>current streak</small></span><span>{streak.longest}<small>longest streak</small></span><span>{dashboard.registrations.filter((registration) => registration.status !== "cancelled").length}<small>events</small></span><span>{certificates.length}<small>sample certificates</small></span></div>}{profile.visibility.projects !== false && <div className="profile-preview-items"><strong>Projects</strong><ul>{dashboard.projects.map((project) => <li key={project.id}>{project.title}</li>)}</ul></div>}{profile.visibility.achievements !== false && <div className="profile-preview-items"><strong>Achievements</strong><ul>{achievements.map((achievement) => <li key={achievement.id}>{achievement.title}</li>)}</ul></div>}{profile.visibility.recentActivity !== false && <div className="profile-preview-items"><strong>Recent activity</strong><ul>{deriveActivityFeed(dashboard).slice(0, 3).map((activity) => <li key={activity.id}>{activity.title}</li>)}</ul></div>}<p className="panel-disclaimer">Email and account details are never included in this preview. Changes apply when you save the profile.</p></div>
        </FeaturePanel>
      </form>
    </div>
  );
}

export function ProjectsPage() {
  const { dashboard, updateDashboard, notify } = useDashboard();
  const blankProject = { title: "", description: "", category: "Web", technologies: "", repositoryUrl: "", liveDemoUrl: "", visibility: "private", status: "draft", eventId: "" };
  const [form, setForm] = useState(blankProject);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const registrations = dashboard.registrations.filter((registration) => registration.status !== "cancelled");
  const submittedCount = dashboard.projects.filter((project) => project.status === "submitted" ||
    dashboard.registrations.some((registration) => registration.eventId === project.eventId &&
      ["submitted", "under_review"].includes(registration.submission.status))).length;
  const completedCount = dashboard.projects.filter((project) => project.status === "completed").length;
  const activeCount = dashboard.projects.filter((project) => project.status === "in-progress").length;
  const invalidUrl = (value) => {
    if (!value) return false;
    try {
      const url = new URL(value);
      return !["http:", "https:"].includes(url.protocol);
    } catch {
      return true;
    }
  };

  const saveProject = (event) => {
    event.preventDefault();
    const title = form.title.trim();
    const description = form.description.trim();
    if (!title || !description) {
      setError("Project title and description are required.");
      return;
    }
    if (dashboard.projects.some((project) => project.id !== editingId && project.title.toLowerCase() === title.toLowerCase())) {
      setError("A project with that title already exists. Edit the existing one instead.");
      return;
    }
    if (invalidUrl(form.repositoryUrl.trim()) || invalidUrl(form.liveDemoUrl.trim())) {
      setError("Links must be valid HTTP or HTTPS URLs.");
      return;
    }
    if (form.eventId && !registrations.some((registration) => registration.eventId === form.eventId)) {
      setError("Choose an event you have a local demo registration for.");
      return;
    }
    if (form.status === "submitted" && !form.eventId) {
      setError("Link this project to a registered event before marking it submitted.");
      return;
    }
    const occurredAt = new Date();
    const id = editingId ?? `project-${occurredAt.getTime()}`;
    const existing = dashboard.projects.find((project) => project.id === editingId);
    const action = editingId ? "updated" : "created";
    const project = {
      ...existing,
      title,
      description,
      category: form.category,
      technologies: [...new Set(form.technologies.split(",").map((technology) => technology.trim()).filter(Boolean))],
      repositoryUrl: form.repositoryUrl.trim(),
      liveDemoUrl: form.liveDemoUrl.trim(),
      visibility: form.visibility,
      status: form.status,
      eventId: form.eventId,
      id,
      createdAt: existing?.createdAt ?? occurredAt.toISOString(),
      updatedAt: occurredAt.toISOString(),
      isDemo: existing?.isDemo ?? false,
      milestones: existing?.milestones ?? [
        ["idea", "Idea finalized"], ["research", "Research completed"], ["design", "Design completed"],
        ["development", "Development started"], ["prototype", "Prototype ready"], ["testing", "Testing completed"],
        ["deployed", "Project deployed"],
      ].map(([milestoneId, milestoneTitle]) => ({ id: milestoneId, title: milestoneTitle, completedAt: null })),
      history: [...(existing?.history ?? []), { id: `history-${occurredAt.getTime()}`, type: action, title: `${action === "created" ? "Project created" : "Project updated"}`, occurredAt: occurredAt.toISOString() }],
    };
    const projects = editingId
      ? dashboard.projects.map((item) => item.id === editingId ? project : item)
      : [project, ...dashboard.projects];
    const submissionStarted = form.status === "submitted" && existing?.status !== "submitted";
    const activityType = submissionStarted ? "event_submission" : "project_update";
    const { state: withActivity, recorded } = recordQualifyingActivity(dashboard, {
      id: `project-${id}-${occurredAt.getTime()}`,
      type: activityType,
      title: `${action === "created" ? "Created" : "Updated"} project: ${title}`,
      entityId: id,
      log: false,
      occurredAt,
    });
    const next = {
      ...withActivity,
      projects,
      activityLog: appendActivityLog(withActivity, {
        id: `${submissionStarted ? "project-submitted" : `project-${action}`}-${id}-${occurredAt.getTime()}`,
        type: submissionStarted ? "project_submitted" : `project_${action}`,
        title: submissionStarted ? `Submitted ${title} to ${eventCatalog.find((event) => event.id === form.eventId)?.title ?? "a registered event"}` : `${action === "created" ? "Created" : "Updated"} project: ${title}`,
        eventId: submissionStarted ? form.eventId : undefined,
        entityId: id,
        occurredAt: occurredAt.toISOString(),
        localDate: getLocalDateKey(occurredAt),
        source: "local",
        isDemo: true,
      }),
    };
    if (updateDashboard(next)) {
      notify(recorded ? "Project saved and today’s activity recorded." : "Project saved; today’s activity was already counted.");
      setForm(blankProject);
      setEditingId(null);
      setError("");
    }
  };

  const editProject = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description ?? "",
      category: project.category ?? "Other",
      technologies: (project.technologies ?? []).join(", "),
      repositoryUrl: project.repositoryUrl ?? "",
      liveDemoUrl: project.liveDemoUrl ?? "",
      visibility: project.visibility ?? "private",
      status: project.status,
      eventId: project.eventId ?? "",
    });
    setError("");
    document.getElementById("project-title")?.focus();
  };

  const deleteProject = (project) => {
    if (!window.confirm(`Remove “${project.title}” from this local workspace?`)) return;
    const occurredAt = new Date();
    const next = {
      ...dashboard,
      projects: dashboard.projects.filter((item) => item.id !== project.id),
      activityLog: appendActivityLog(dashboard, {
        id: `project-deleted-${project.id}-${occurredAt.getTime()}`,
        type: "project_deleted",
        title: `Removed project: ${project.title}`,
        entityId: project.id,
        occurredAt: occurredAt.toISOString(),
        localDate: getLocalDateKey(occurredAt),
        source: "local",
        isDemo: true,
      }),
    };
    if (updateDashboard(next)) {
      if (editingId === project.id) {
        setEditingId(null);
        setForm(blankProject);
      }
      notify("Project removed from this device.");
    }
  };

  return (
    <div className="feature-page">
      <PageIntro eyebrow="YOUR IDEA WORKSPACE" title="Projects, in progress." description="A local project tracker for ideas, milestones, links, and event work. It is not a cloud workspace or collaborative editor." icon={FolderKanban} />
      <div className="project-layout">
        <FeaturePanel>
          <div className="project-summary-grid"><div><span>TOTAL</span><strong>{dashboard.projects.length}</strong></div><div><span>ACTIVE</span><strong>{activeCount}</strong></div><div><span>COMPLETED</span><strong>{completedCount}</strong></div><div><span>SUBMITTED</span><strong>{submittedCount}</strong></div></div>
          <div className="feature-panel-heading"><div><span className="dash-eyebrow">PROJECT SPACE</span><h2>{dashboard.projects.length} project{dashboard.projects.length === 1 ? "" : "s"}</h2></div><span className="sample-chip">SAMPLES LABELED</span></div>
          <div className="project-list">
            {dashboard.projects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-card-top"><span className={`project-status status-${project.status}`}>{project.status.replace("-", " ")}</span>{project.isDemo && <span className="sample-chip">SAMPLE</span>}</div>
                <h3><Link to={`/app/projects/${project.id}`}>{project.title}</Link></h3>
                <p>{project.description}</p>
                <span className="project-category">{project.category} · {(project.technologies ?? []).slice(0, 3).join(", ") || "No technologies added"}</span>
                <div className="project-progress"><span>{project.milestones.filter((milestone) => milestone.completedAt).length} / {project.milestones.length} milestones</span><span>{Math.round((project.milestones.filter((milestone) => milestone.completedAt).length / project.milestones.length) * 100)}%</span></div>
                <div className="goal-track" role="progressbar" aria-label={`${project.title} milestone progress`} aria-valuemin={0} aria-valuemax={project.milestones.length} aria-valuenow={project.milestones.filter((milestone) => milestone.completedAt).length}><span style={{ width: `${Math.round((project.milestones.filter((milestone) => milestone.completedAt).length / project.milestones.length) * 100)}%` }} /></div>
                {project.eventId && <span className="project-category">Linked event: {eventCatalog.find((item) => item.id === project.eventId)?.title ?? "Sample event"}</span>}
                <div className="project-card-actions"><button type="button" className="text-action" onClick={() => editProject(project)}>Edit details</button><button type="button" className="icon-action" aria-label={`Remove ${project.title}`} onClick={() => deleteProject(project)}><Trash2 size={15} /></button></div>
              </article>
            ))}
            {!dashboard.projects.length && <p className="feature-empty">No projects yet. Use the form to add one.</p>}
          </div>
        </FeaturePanel>
        <form className="feature-form project-form" onSubmit={saveProject}>
          <FeaturePanel>
            <div className="feature-panel-heading"><div><span className="dash-eyebrow">{editingId ? "EDIT PROJECT" : "START SOMETHING"}</span><h2>{editingId ? "Update your idea." : "New project"}</h2></div></div>
            <label className="feature-field" htmlFor="project-title"><span>Project title</span><input id="project-title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} maxLength={70} /></label>
            <label className="feature-field"><span>What are you building?</span><textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} maxLength={320} /></label>
            <label className="feature-field"><span>Category</span><select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}><option>Web</option><option>AI / Data</option><option>Design</option><option>Social impact</option><option>Community</option><option>Other</option></select></label>
            <label className="feature-field"><span>Technologies <small>(comma separated)</small></span><input value={form.technologies} onChange={(event) => setForm({ ...form, technologies: event.target.value })} maxLength={180} placeholder="React, CSS, Figma" /></label>
            <label className="feature-field"><span>Repository URL <small>(optional)</small></span><input value={form.repositoryUrl} onChange={(event) => setForm({ ...form, repositoryUrl: event.target.value })} maxLength={240} inputMode="url" placeholder="https://github.com/…" /></label>
            <label className="feature-field"><span>Live demo URL <small>(optional)</small></span><input value={form.liveDemoUrl} onChange={(event) => setForm({ ...form, liveDemoUrl: event.target.value })} maxLength={240} inputMode="url" placeholder="https://…" /></label>
            <label className="feature-field"><span>Visibility</span><select value={form.visibility} onChange={(event) => setForm({ ...form, visibility: event.target.value })}><option value="private">Private to this browser</option><option value="public">Public preview (not published)</option></select></label>
            <label className="feature-field"><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="draft">Idea / draft</option><option value="in-progress">In progress</option><option value="paused">Paused</option><option value="completed">Completed</option><option value="submitted">Submitted to event</option></select></label>
            <label className="feature-field"><span>Registered event <small>(optional)</small></span><select value={form.eventId} onChange={(event) => setForm({ ...form, eventId: event.target.value })}><option value="">No event linked</option>{registrations.map((registration) => { const event = eventCatalog.find((item) => item.id === registration.eventId); return event ? <option value={event.id} key={event.id}>{event.title} · sample registration</option> : null; })}</select></label>
            {error && <p className="feature-inline-error" role="alert">{error}</p>}
            <div className="feature-form-actions"><button className="button button-purple" type="submit"><Save size={15} /> {editingId ? "Save changes" : "Add project"}</button>{editingId && <button className="button button-outline" type="button" onClick={() => { setEditingId(null); setForm(blankProject); setError(""); }}>Cancel</button>}</div>
            <p className="panel-disclaimer">Saving a project is a qualifying action for the local demo streak, at most once per calendar day.</p>
          </FeaturePanel>
        </form>
      </div>
    </div>
  );
}

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const { dashboard, updateDashboard, notify } = useDashboard();
  const project = dashboard.projects.find((item) => item.id === projectId);
  if (!project) {
    return <section className="event-not-found"><span className="dash-eyebrow">PROJECT NOT FOUND</span><h1>This project isn’t in your workspace.</h1><Link className="button button-purple" to="/app/projects">Back to projects</Link></section>;
  }
  const completed = project.milestones.filter((milestone) => milestone.completedAt).length;
  const progress = project.milestones.length ? Math.round((completed / project.milestones.length) * 100) : 0;
  const linkedEvent = eventCatalog.find((event) => event.id === project.eventId);

  const toggleMilestone = (milestone) => {
    const now = new Date();
    const completing = !milestone.completedAt;
    const milestones = project.milestones.map((item) => item.id === milestone.id
      ? { ...item, completedAt: completing ? now.toISOString() : null }
      : item);
    const historyEntry = {
      id: `history-${milestone.id}-${now.getTime()}`,
      type: completing ? "milestone_completed" : "milestone_reopened",
      title: `${completing ? "Completed" : "Reopened"} milestone: ${milestone.title}`,
      occurredAt: now.toISOString(),
    };
    const updatedProject = { ...project, milestones, updatedAt: now.toISOString(), history: [...project.history, historyEntry] };
    const { state: withStreak } = completing
      ? recordQualifyingActivity(dashboard, { id: `milestone-${project.id}-${milestone.id}-${now.getTime()}`, type: "project_update", log: false, occurredAt: now })
      : { state: dashboard };
    const next = {
      ...withStreak,
      projects: withStreak.projects.map((item) => item.id === project.id ? updatedProject : item),
      activityLog: appendActivityLog(withStreak, {
        id: `activity-${historyEntry.id}`,
        type: historyEntry.type,
        title: `${historyEntry.title} · ${project.title}`,
        entityId: project.id,
        occurredAt: now.toISOString(),
        localDate: getLocalDateKey(now),
        source: "local",
        isDemo: true,
      }),
    };
    if (updateDashboard(next)) notify(completing ? "Milestone completed and saved locally." : "Milestone reopened locally.");
  };

  const updateStatus = (status) => {
    if (status === "submitted" && !project.eventId) {
      notify("Link this project to a registered event before marking it submitted.");
      return;
    }
    const now = new Date();
    const previousStatus = project.status;
    const historyEntry = { id: `history-status-${now.getTime()}`, type: "status_changed", title: `Status changed from ${previousStatus} to ${status}`, occurredAt: now.toISOString() };
    const nextProject = { ...project, status, updatedAt: now.toISOString(), history: [...project.history, historyEntry] };
    let nextState = { ...dashboard, projects: dashboard.projects.map((item) => item.id === project.id ? nextProject : item) };
    if (status === "submitted" && previousStatus !== "submitted") {
      nextState = recordQualifyingActivity(nextState, { id: `project-submitted-${project.id}-${now.getTime()}`, type: "event_submission", log: false, occurredAt: now }).state;
      nextState.activityLog = appendActivityLog(nextState, {
        id: `project-submitted-log-${project.id}-${now.getTime()}`,
        type: "project_submitted",
        title: `Submitted ${project.title} to ${eventCatalog.find((event) => event.id === project.eventId)?.title ?? "a sample event"}`,
        entityId: project.id,
        eventId: project.eventId,
        occurredAt: now.toISOString(),
        localDate: getLocalDateKey(now),
        source: "local",
        isDemo: true,
      });
    } else {
      nextState.activityLog = appendActivityLog(nextState, {
        id: `project-status-${project.id}-${now.getTime()}`,
        type: "project_status",
        title: `Updated ${project.title} status to ${status.replace("-", " ")}`,
        entityId: project.id,
        occurredAt: now.toISOString(),
        localDate: getLocalDateKey(now),
        source: "local",
        isDemo: true,
      });
    }
    if (updateDashboard(nextState)) {
      notify("Project status saved on this device.");
    }
  };

  return (
    <div className="feature-page project-detail-page">
      <Link to="/app/projects" className="event-back-link"><FolderKanban size={15} /> My Projects</Link>
      <PageIntro eyebrow={`PROJECT WORKSPACE / ${project.category.toUpperCase()}`} title={project.title} description={project.description} icon={Target} />
      <div className="project-detail-grid">
        <div className="project-detail-main">
          <FeaturePanel>
            <div className="feature-panel-heading"><div><span className="dash-eyebrow">MILESTONE PROGRESS</span><h2>{completed} of {project.milestones.length} complete</h2></div><strong className="project-progress-percent">{progress}%</strong></div>
            <div className="goal-track project-detail-progress" role="progressbar" aria-label="Project milestone progress" aria-valuemin={0} aria-valuemax={project.milestones.length} aria-valuenow={completed}><span style={{ width: `${progress}%` }} /></div>
            <ol className="project-milestone-list">{project.milestones.map((milestone, index) => <li key={milestone.id} className={milestone.completedAt ? "is-complete" : ""}><span className="milestone-index">{milestone.completedAt ? <CheckCircle2 size={17} /> : String(index + 1).padStart(2, "0")}</span><div><strong>{milestone.title}</strong><small>{milestone.completedAt ? `Completed ${new Date(milestone.completedAt).toLocaleDateString()}` : "Not completed yet"}</small></div><button type="button" className="button button-outline" aria-pressed={Boolean(milestone.completedAt)} onClick={() => toggleMilestone(milestone)}>{milestone.completedAt ? "Reopen" : "Mark complete"}</button></li>)}</ol>
            <p className="panel-disclaimer">Milestone completion contributes to one active streak day per local calendar day. These updates stay in this browser.</p>
          </FeaturePanel>
          <FeaturePanel>
            <div className="feature-panel-heading"><div><span className="dash-eyebrow">PROJECT HISTORY</span><h2>Recent changes</h2></div><History size={17} /></div>
            {project.history.length ? <ol className="project-history-list">{[...project.history].reverse().slice(0, 10).map((entry) => <li key={entry.id}><span>{entry.title}</span><time dateTime={entry.occurredAt}>{new Date(entry.occurredAt).toLocaleString()}</time></li>)}</ol> : <p className="feature-empty">Project history will appear as you update this workspace.</p>}
          </FeaturePanel>
        </div>
        <aside className="project-detail-aside">
          <FeaturePanel>
            <div className="feature-panel-heading"><div><span className="dash-eyebrow">PROJECT DETAILS</span><h2>Workspace info</h2></div></div>
            <label className="feature-field"><span>Status</span><select value={project.status} onChange={(event) => updateStatus(event.target.value)}><option value="draft">Idea / draft</option><option value="in-progress">In progress</option><option value="paused">Paused</option><option value="completed">Completed</option><option value="submitted">Submitted to event</option></select></label>
            <dl className="project-facts"><div><dt>Category</dt><dd>{project.category}</dd></div><div><dt>Visibility</dt><dd>{project.visibility === "public" ? "Public preview (not published)" : "Private to this browser"}</dd></div><div><dt>Created</dt><dd>{new Date(project.createdAt).toLocaleDateString()}</dd></div><div><dt>Last updated</dt><dd>{new Date(project.updatedAt).toLocaleDateString()}</dd></div></dl>
            <div className="project-tech-list"><strong>Technologies</strong><ul>{project.technologies.length ? project.technologies.map((technology) => <li key={technology}>{technology}</li>) : <li>None added</li>}</ul></div>
            {linkedEvent && <div className="project-linked-event"><span className="dash-eyebrow">ASSOCIATED SAMPLE EVENT</span><Link to={`/app/events/${linkedEvent.id}/hub`}>{linkedEvent.title} ↗</Link></div>}
            <div className="project-external-links">{project.repositoryUrl && <a href={project.repositoryUrl} target="_blank" rel="noreferrer"><Github size={15} />Repository <ExternalLink size={13} /></a>}{project.liveDemoUrl && <a href={project.liveDemoUrl} target="_blank" rel="noreferrer"><ExternalLink size={15} />Live demo</a>}{!project.repositoryUrl && !project.liveDemoUrl && <p>No project links added.</p>}</div>
          </FeaturePanel>
        </aside>
      </div>
    </div>
  );
}

export function AchievementsPage() {
  const { dashboard } = useDashboard();
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState(null);
  const achievements = deriveAchievements(dashboard);
  const earnedCount = achievements.filter((achievement) => achievement.unlocked).length;
  const categories = ["All", ...new Set(achievements.map((achievement) => achievement.category))];
  const visibleAchievements = achievements.filter((achievement) => category === "All" || achievement.category === category);
  return (
    <div className="feature-page">
      <PageIntro eyebrow="PROGRESS / LOCAL CRITERIA" title="Small wins count." description="Achievements unlock from activity, project milestones, and event records in this browser. They are demo awards, not official credentials." icon={Award} />
      <FeaturePanel>
        <div className="feature-panel-heading"><div><span className="dash-eyebrow">ACHIEVEMENT GALLERY</span><h2>{earnedCount} of {achievements.length} unlocked</h2></div><span className="sample-chip">LOCAL DEMO</span></div>
        <div className="achievement-filters" aria-label="Filter achievements by category">{categories.map((item) => <button type="button" className={category === item ? "is-active" : ""} key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="achievement-grid">
          {visibleAchievements.map((achievement) => (
            <button type="button" className={`achievement-card${achievement.unlocked ? " is-earned" : ""}`} key={achievement.id} onClick={() => setSelected(achievement)} aria-label={`${achievement.title}, ${achievement.status}, ${achievement.progress} of ${achievement.target}`}>
              <span className="achievement-mark">{achievement.unlocked ? <Check size={19} /> : <Award size={19} />}</span>
              <span className="dash-eyebrow">{achievement.category}</span>
              <strong className="achievement-title">{achievement.title}</strong>
              <span className="achievement-description">{achievement.description}</span>
              <span className="achievement-progress"><span style={{ width: `${Math.round((achievement.progress / achievement.target) * 100)}%` }} /></span>
              <span className="achievement-state">{achievement.unlocked ? `${achievement.isSample ? "Sample" : "Unlocked"} · ${achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : "criteria met"}` : achievement.progress ? `In progress · ${achievement.progress} / ${achievement.target}` : "Locked"}</span>
            </button>
          ))}
        </div>
      </FeaturePanel>
      <p className="panel-disclaimer">Achievements are calculated from local activity and workspace records. No award is issued, verified, or shared.</p>
      <AchievementDetailDialog achievement={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function AchievementDetailDialog({ achievement, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (achievement && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [achievement]);
  return <dialog className="certificate-dialog achievement-dialog" ref={dialogRef} onClose={onClose} onCancel={onClose} onKeyDown={(event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      dialogRef.current?.close();
    }
  }} aria-label="Achievement details">{achievement && <div className="certificate-preview"><button type="button" className="event-dialog-close" aria-label="Close achievement details" onClick={() => dialogRef.current?.close()}><X size={18} /></button><span className="achievement-mark">{achievement.unlocked ? <Check size={19} /> : <Award size={19} />}</span><span className="dash-eyebrow">{achievement.category} / {achievement.status.toUpperCase()}</span><h2>{achievement.title}</h2><p>{achievement.description}</p><div className="achievement-detail-progress"><span style={{ width: `${Math.round((achievement.progress / achievement.target) * 100)}%` }} /></div><strong>{achievement.progress} of {achievement.target} toward this achievement</strong>{achievement.unlockedAt && <span className="certificate-name">Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}</span>}<button type="button" className="button button-purple" onClick={() => dialogRef.current?.close()}>Close details</button></div>}</dialog>;
}

export function ActivityPage() {
  const { dashboard } = useDashboard();
  const [type, setType] = useState("all");
  const [limit, setLimit] = useState(12);
  const activities = deriveActivityFeed(dashboard);
  const types = ["all", ...new Set(activities.map((activity) => activity.type))];
  const filtered = activities.filter((activity) => type === "all" || activity.type === type);
  const shown = filtered.slice(0, limit);
  const activityIcon = (activityType) => activityType.includes("project") || activityType.includes("milestone") ? FolderKanban
    : activityType.includes("event") || activityType.includes("bookmark") ? CalendarDays
      : activityType === "achievement" ? Medal
        : activityType.includes("streak") ? Award : Check;
  const activityLink = (activity) => {
    if (activity.entityId && dashboard.projects.some((project) => project.id === activity.entityId)) return `/app/projects/${activity.entityId}`;
    if (activity.eventId) return `/app/events/${activity.eventId}`;
    return null;
  };
  return <div className="feature-page">
    <PageIntro eyebrow="YOUR GROWTH TIMELINE" title="Activity, in context." description="A chronological feed derived from actions and records in this browser. Sample fixtures are labeled; no platform-wide activity is shown." icon={History} />
    <FeaturePanel>
      <div className="feature-panel-heading"><div><span className="dash-eyebrow">LOCAL ACTIVITY LOG</span><h2>{filtered.length} {filtered.length === 1 ? "entry" : "entries"}</h2></div><span className="sample-chip">DEVICE ONLY</span></div>
      <label className="feature-field activity-filter"><span>Filter activity type</span><select value={type} onChange={(event) => { setType(event.target.value); setLimit(12); }}>{types.map((item) => <option value={item} key={item}>{item === "all" ? "All activity" : item.replaceAll("_", " ")}</option>)}</select></label>
      {shown.length ? <ol className="activity-feed-list">{shown.map((activity) => {
        const Icon = activityIcon(activity.type);
        const link = activityLink(activity);
        const body = <><span className="activity-feed-icon"><Icon size={16} /></span><span className="activity-feed-copy"><strong>{activity.title}</strong><small>{new Date(activity.occurredAt).toLocaleString()} · {activity.source === "sample" ? "Illustrative sample" : "Recorded on this device"}</small></span>{link && <ExternalLink size={14} aria-hidden="true" />}</>;
        return <li key={activity.id}>{link ? <Link to={link}>{body}</Link> : <div>{body}</div>}</li>;
      })}</ol> : <div className="feature-empty"><History size={20} /><p>{activities.length ? "No activity matches this filter." : "No recorded activity yet. Complete a project milestone, update a project, register, bookmark, or submit to build your timeline."}</p></div>}
      {shown.length < filtered.length && <button className="button button-outline" type="button" onClick={() => setLimit((value) => value + 12)}>Load more activity</button>}
    </FeaturePanel>
  </div>;
}

function CertificateDialog({ certificate, name, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (certificate && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [certificate]);

  return (
    <dialog className="certificate-dialog" ref={dialogRef} onClose={onClose} onCancel={onClose} onKeyDown={(event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dialogRef.current?.close();
      }
    }} aria-label="Sample certificate preview">
      {certificate && <div className="certificate-preview">
        <span className="certificate-stamp">SAMPLE · NOT VALID</span>
        <span className="dash-eyebrow">CAMPUSCODE / PARTICIPATION PREVIEW</span>
        <h2>{certificate.type ?? "Certificate of participation"}</h2>
        <p>This sample preview illustrates how a completion record might appear. It is not an issued certificate.</p>
        <strong>{certificate.title}</strong>
        <span className="certificate-name">{name}</span>
        <span className="certificate-date">Sample completion date · {certificate.issueDate ? new Date(certificate.issueDate).toLocaleDateString() : "not available"}</span>
        <button type="button" className="button button-purple" onClick={() => dialogRef.current?.close()}>Close preview</button>
      </div>}
    </dialog>
  );
}

export function CertificatesPage() {
  const { dashboard } = useDashboard();
  const [selected, setSelected] = useState(null);
  const certificates = getCertificateRecords(dashboard);
  return (
    <div className="feature-page">
      <PageIntro eyebrow="COMPLETION / PREVIEW ONLY" title="A record of the work." description="A central collection of sample certificate concepts derived from completed event registrations." icon={BookOpenCheck} />
      <FeaturePanel>
        <div className="feature-panel-heading"><div><span className="dash-eyebrow">CERTIFICATE COLLECTION</span><h2>{certificates.length} sample record{certificates.length === 1 ? "" : "s"}</h2></div><span className="sample-chip">NOT OFFICIAL</span></div>
        {certificates.length ? <div className="certificate-list">
          {certificates.map((certificate) => <article className="certificate-card" key={certificate.id}><span className="certificate-icon"><BookOpenCheck size={19} /></span><div><span className="dash-eyebrow">{certificate.type.toUpperCase()} / DEMO</span><h3>{certificate.title}</h3><p>{certificate.participantName} · Sample completion · {new Date(certificate.issueDate).toLocaleDateString()}</p></div><button type="button" className="button button-outline" onClick={() => setSelected(certificate)}>Preview <BookOpenCheck size={15} /></button></article>)}
        </div> : <p className="feature-empty">A sample certificate appears when an illustrative event is marked completed.</p>}
      </FeaturePanel>
      <CertificateDialog certificate={selected} name={dashboard.profile.name} onClose={() => setSelected(null)} />
    </div>
  );
}

export function NotificationsPage() {
  const { dashboard, updateDashboard, notify } = useDashboard();
  const visibleNotifications = getVisibleNotifications(dashboard);
  const unread = visibleNotifications.filter((item) => !item.read).length;

  const updateNotifications = (callback, message) => {
    if (updateDashboard({ ...dashboard, notifications: callback(dashboard.notifications) })) notify(message);
  };

  return (
    <div className="feature-page">
      <PageIntro eyebrow="YOUR LOCAL UPDATES" title="A little nudge, when useful." description="These example reminders are stored in this browser. They do not send email or push notifications." icon={Bell} />
      <FeaturePanel>
        <div className="feature-panel-heading"><div><span className="dash-eyebrow">NOTIFICATION CENTRE</span><h2>{unread ? `${unread} unread` : "You’re all caught up"}</h2></div>
          {unread > 0 && <button type="button" className="text-action" onClick={() => {
            const visibleIds = new Set(visibleNotifications.map((item) => item.id));
            updateNotifications((items) => items.map((item) => visibleIds.has(item.id) ? { ...item, read: true } : item), "Example notifications marked as read.");
          }}>Mark all read</button>}
        </div>
        <div className="notification-list">
          {visibleNotifications.map((item) => <article className={`notification-card${item.read ? " is-read" : ""}`} key={item.id}>
            <span className="notification-dot" aria-label={item.read ? "Read" : "Unread"} />
            <div><h3>{item.title}</h3><p>{item.message}</p><small>{new Date(item.occurredAt).toLocaleDateString()} · Example reminder</small></div>
            <div className="notification-actions">{!item.read && <button type="button" className="text-action" onClick={() => updateNotifications((items) => items.map((entry) => entry.id === item.id ? { ...entry, read: true } : entry), "Example notification marked as read.")}>Mark read</button>}<button type="button" className="icon-action" aria-label={`Dismiss ${item.title}`} onClick={() => updateNotifications((items) => items.filter((entry) => entry.id !== item.id), "Example notification dismissed.")}><X size={15} /></button></div>
          </article>)}
          {!visibleNotifications.length && <div className="feature-empty"><Bell size={20} /><p>No local reminders. Your workspace is quiet.</p><Link className="text-action" to="/app/settings">Review reminder preferences</Link></div>}
        </div>
      </FeaturePanel>
    </div>
  );
}

export function SettingsPage() {
  const { dashboard, updateDashboard, notify, resetDemo } = useDashboard();
  const setSetting = (key, value) => {
    if (updateDashboard({ ...dashboard, settings: { ...dashboard.settings, [key]: value } })) notify("Local reminder preference saved.");
  };
  const changeGoal = (amount) => {
    const target = Math.min(7, Math.max(1, dashboard.weeklyGoal.target + amount));
    if (target !== dashboard.weeklyGoal.target && updateDashboard({ ...dashboard, weeklyGoal: { target } })) notify("Weekly activity goal updated.");
  };

  return (
    <div className="feature-page">
      <PageIntro eyebrow="WORKSPACE PREFERENCES" title="Set a gentle pace." description="Adjust local goals, sample reminders, or reset this browser’s workspace data." icon={CircleHelp} />
      <div className="settings-stack">
        <FeaturePanel>
          <div className="feature-panel-heading"><div><span className="dash-eyebrow">WEEKLY PRACTICE</span><h2>Activity goal</h2></div></div>
          <p className="feature-description">Choose how many days in a week you would like to record a qualifying activity.</p>
          <div className="goal-setting"><strong>{dashboard.weeklyGoal.target}<span> days / week</span></strong><div><button type="button" className="button button-outline" onClick={() => changeGoal(-1)} disabled={dashboard.weeklyGoal.target <= 1} aria-label="Reduce weekly goal">−</button><button type="button" className="button button-outline" onClick={() => changeGoal(1)} disabled={dashboard.weeklyGoal.target >= 7} aria-label="Increase weekly goal">+</button></div></div>
        </FeaturePanel>
        <FeaturePanel>
          <div className="feature-panel-heading"><div><span className="dash-eyebrow">LOCAL REMINDERS</span><h2>What would you like to see?</h2></div></div>
          <label className="preference-row"><span><strong>Event deadline examples</strong><small>Show local demo reminders about sample event dates.</small></span><input type="checkbox" checked={dashboard.settings.deadlineReminders} onChange={(event) => setSetting("deadlineReminders", event.target.checked)} /></label>
          <label className="preference-row"><span><strong>Project nudges</strong><small>Show local demo reminders about project workspace items.</small></span><input type="checkbox" checked={dashboard.settings.projectReminders} onChange={(event) => setSetting("projectReminders", event.target.checked)} /></label>
          <p className="panel-disclaimer">These settings do not connect to email, push notifications, or any server.</p>
        </FeaturePanel>
        <FeaturePanel className="settings-reset-panel">
          <div><span className="dash-eyebrow">START OVER</span><h2>Reset workspace data</h2><p>This removes profile edits, projects, reminders, and activity saved in this browser and restores the sample records.</p></div>
          <button type="button" className="button button-outline" onClick={resetDemo}><Trash2 size={15} /> Reset local demo</button>
        </FeaturePanel>
      </div>
    </div>
  );
}
