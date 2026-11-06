import { useMemo, useRef, useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  ExternalLink,
  FilterX,
  Flag,
  Heart,
  Info,
  MapPin,
  Medal,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { eventCatalog } from "../data/eventsMockData.js";
import { appendActivityLog, getCertificateRecords, getRegistrationStatus, recordQualifyingActivity } from "../state/dashboardState.js";
import { useDashboard } from "../components/DashboardLayout.jsx";
import { getLocalDateKey } from "../utils/localDate.js";

const dateFormat = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" });
const dateTimeFormat = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
const categoryOptions = [...new Set(eventCatalog.map((event) => event.category))].sort();
const modeOptions = [...new Set(eventCatalog.map((event) => event.mode))].sort();
const difficultyOptions = [...new Set(eventCatalog.map((event) => event.difficulty))].sort();

function formatDate(value) {
  return value ? dateFormat.format(new Date(value)) : "Date to be announced";
}

function formatDateTime(value) {
  return value ? dateTimeFormat.format(new Date(value)) : "Date to be announced";
}

function modeIcon(mode) {
  return mode === "Offline" ? MapPin : mode === "Hybrid" ? Users : ExternalLink;
}

function getEventRegistration(dashboard, eventId) {
  return dashboard.registrations.find((registration) => registration.eventId === eventId);
}

function eventAvailability(event, registration) {
  if (registration) return "Registered";
  if (new Date(event.registrationDeadline) < new Date()) return "Closed";
  return "Open";
}

function EventStatus({ children, tone = "neutral" }) {
  return <span className={`event-status event-status-${tone}`}><i aria-hidden="true" />{children}</span>;
}

function EventCard({ event, dashboard, onBookmark, featured = false }) {
  const registration = getEventRegistration(dashboard, event.id);
  const bookmarked = dashboard.bookmarks.includes(event.id);
  const availability = eventAvailability(event, registration);
  const ModeIcon = modeIcon(event.mode);

  return (
    <article className={`event-discovery-card${featured ? " is-featured" : ""}`}>
      {featured && <span className="event-card-ribbon"><Sparkles size={12} /> EDITOR'S PICK / SAMPLE</span>}
      <div className="event-card-heading">
        <span className="event-category-tag">{event.category}</span>
        <button className={`event-bookmark${bookmarked ? " is-saved" : ""}`} type="button" aria-label={`${bookmarked ? "Remove bookmark from" : "Bookmark"} ${event.title}`} aria-pressed={bookmarked} onClick={() => onBookmark(event)}>
          <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
        </button>
      </div>
      <h2>{event.title}</h2>
      <p className="event-card-organizer">by {event.organizer.name}</p>
      <p className="event-card-description">{event.description}</p>
      <div className="event-card-meta">
        <span><ModeIcon size={14} />{event.mode}</span>
        <span><Flag size={14} />{event.difficulty}</span>
        <span><Users size={14} />{event.teamSize.min === event.teamSize.max ? `${event.teamSize.min} participant${event.teamSize.min === 1 ? "" : "s"}` : `${event.teamSize.min}–${event.teamSize.max} people`}</span>
      </div>
      <div className="event-card-dates">
        <span><small>REGISTRATION CLOSES</small><strong>{formatDate(event.registrationDeadline)}</strong></span>
        <span><small>EVENT STARTS</small><strong>{formatDate(event.startsAt)}</strong></span>
      </div>
      <div className="event-card-footer">
        <EventStatus tone={availability.toLowerCase()}>{availability}</EventStatus>
        <Link className="event-view-link" to={`/app/events/${event.id}`}>View details <ArrowUpRight size={15} /></Link>
      </div>
      {event.isDemo && <span className="event-sample-note">Illustrative event · not a live listing</span>}
    </article>
  );
}

function toggleBookmark(dashboard, updateDashboard, notify, event) {
  const saved = dashboard.bookmarks.includes(event.id);
  const bookmarks = saved
    ? dashboard.bookmarks.filter((id) => id !== event.id)
    : [...dashboard.bookmarks, event.id];
  const occurredAt = new Date();
  const next = {
    ...dashboard,
    bookmarks,
    activityLog: appendActivityLog(dashboard, {
      id: `bookmark-${saved ? "removed" : "saved"}-${event.id}-${occurredAt.getTime()}`,
      type: saved ? "bookmark_removed" : "bookmark_saved",
      title: `${saved ? "Removed bookmark for" : "Saved"} ${event.title}`,
      eventId: event.id,
      occurredAt: occurredAt.toISOString(),
      localDate: getLocalDateKey(occurredAt),
      source: "local",
      isDemo: true,
    }),
  };
  if (updateDashboard(next)) {
    notify(saved ? `${event.title} removed from saved events.` : `${event.title} saved on this device.`);
  }
}

function FilterSelect({ label, value, options, onChange }) {
  const allLabel = { Category: "categories", Mode: "modes", Difficulty: "difficulties", Status: "statuses" }[label] ?? `${label.toLowerCase()}s`;
  return (
    <label className="event-filter-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">All {allLabel}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select><ChevronDown size={13} aria-hidden="true" /></label>
  );
}

export function DiscoverEventsPage() {
  const { dashboard, updateDashboard, notify } = useDashboard();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [mode, setMode] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("deadline");
  const [savedOnly, setSavedOnly] = useState(false);

  const filteredEvents = useMemo(() => {
    const search = query.trim().toLowerCase();
    const results = eventCatalog.filter((event) => {
      const registration = getEventRegistration(dashboard, event.id);
      const matchesSearch = !search || `${event.title} ${event.organizer.name} ${event.description} ${event.category}`.toLowerCase().includes(search);
      const matchesStatus = !status || eventAvailability(event, registration) === status;
      return matchesSearch &&
        (!category || event.category === category) &&
        (!mode || event.mode === mode) &&
        (!difficulty || event.difficulty === difficulty) &&
        matchesStatus &&
        (!savedOnly || dashboard.bookmarks.includes(event.id));
    });
    return results.sort((left, right) => sort === "newest"
      ? new Date(right.publishedAt) - new Date(left.publishedAt)
      : new Date(left.registrationDeadline) - new Date(right.registrationDeadline));
  }, [query, category, mode, difficulty, status, sort, savedOnly, dashboard]);

  const activeFilters = [
    category && { label: category, clear: () => setCategory("") },
    mode && { label: mode, clear: () => setMode("") },
    difficulty && { label: difficulty, clear: () => setDifficulty("") },
    status && { label: status, clear: () => setStatus("") },
    savedOnly && { label: "Saved only", clear: () => setSavedOnly(false) },
  ].filter(Boolean);
  const hasFilters = !!(query || activeFilters.length);
  const clearAll = () => {
    setQuery("");
    setCategory("");
    setMode("");
    setDifficulty("");
    setStatus("");
    setSavedOnly(false);
  };
  const featured = eventCatalog.find((event) => event.featured);

  return (
    <div className="event-page">
      <header className="event-discover-hero">
        <div className="event-discover-copy">
          <span className="dash-eyebrow">DISCOVER / YOUR NEXT CHAPTER</span>
          <h1>Find Your Next<br /><em>Challenge.</em></h1>
          <p>Explore thoughtful, sample opportunities to learn, make, and test an idea with a team.</p>
          <div className="event-hero-actions"><a className="button button-purple" href="#event-results">Browse opportunities <ArrowRight size={16} /></a><Link className="event-quiet-link" to="/app/my-events">My Events <ArrowUpRight size={14} /></Link></div>
        </div>
        <div className="event-discover-art" aria-label="Illustrative Campus Climate Jam event highlight">
          <span className="event-art-label">A SAMPLE PROMPT / 01</span>
          <span className="event-art-orbit" aria-hidden="true" />
          <span className="event-art-core"><span>MAKE<br />ROOM<br />FOR<br /><i>BETTER.</i></span></span>
          <span className="event-art-caption"><strong>Campus Climate Jam</strong><small>OPEN INNOVATION · HYBRID</small></span>
        </div>
      </header>

      <div className="event-metrics-strip">
        <span><strong>{eventCatalog.length}</strong> sample opportunities</span>
        <span><strong>{categoryOptions.length}</strong> categories</span>
        <span className="event-metrics-note"><Info size={14} /> All listings and organizers are fictional demo content.</span>
        <Link to="/app/my-events">Track your events <ArrowRight size={14} /></Link>
      </div>

      <section className="event-featured-section" aria-labelledby="featured-event-title">
        <div className="event-section-heading"><div><span className="dash-eyebrow">A STARTING POINT</span><h2>Featured opportunity</h2></div><span className="event-index">01 / 01</span></div>
        {featured && <div className="event-featured-card">
          <div className="event-featured-copy"><span className="event-category-tag">{featured.category} / SAMPLE</span><h3 id="featured-event-title">{featured.title}</h3><p>{featured.fullDescription}</p><div className="event-featured-meta"><span><CalendarDays size={15} /> Starts {formatDate(featured.startsAt)}</span><span><Clock3 size={15} /> Closes {formatDate(featured.registrationDeadline)}</span><span><Users size={15} /> Teams up to {featured.teamSize.max}</span></div><Link className="button button-purple" to={`/app/events/${featured.id}`}>Explore event <ArrowRight size={16} /></Link></div>
          <div className="event-featured-side"><span className="featured-side-number">01</span><span className="featured-side-label">SMALL IDEA.<br />REAL-WORLD<br />CURIOSITY.</span><span className="featured-side-rule" /><span className="featured-side-caption">Fictional prompt<br />for this prototype</span></div>
        </div>}
      </section>

      <section className="event-list-section" id="event-results" aria-labelledby="event-results-title">
        <div className="event-section-heading event-list-title"><div><span className="dash-eyebrow">THE OPPORTUNITY BOARD</span><h2 id="event-results-title">Browse the board<span>.</span></h2></div><Link className="event-quiet-link" to="/app/my-events">Registered & saved <ArrowRight size={14} /></Link></div>
        <div className="event-search-row">
          <label className="event-search-field"><Search size={17} aria-hidden="true" /><span className="visually-hidden">Search events or organizers</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search events, organizers, or ideas" /></label>
          <button type="button" className={`event-saved-toggle${savedOnly ? " is-active" : ""}`} aria-pressed={savedOnly} onClick={() => setSavedOnly(!savedOnly)}><Heart size={15} fill={savedOnly ? "currentColor" : "none"} /> Saved <span>{dashboard.bookmarks.length}</span></button>
        </div>
        <div className="event-filter-row">
          <FilterSelect label="Category" value={category} options={categoryOptions} onChange={setCategory} />
          <FilterSelect label="Mode" value={mode} options={modeOptions} onChange={setMode} />
          <FilterSelect label="Difficulty" value={difficulty} options={difficultyOptions} onChange={setDifficulty} />
          <FilterSelect label="Status" value={status} options={["Open", "Registered", "Closed"]} onChange={setStatus} />
          <label className="event-sort-field"><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="deadline">Closing soon</option><option value="newest">Recently added</option></select></label>
          {hasFilters && <button className="event-clear-filters" type="button" onClick={clearAll}><FilterX size={14} /> Clear all</button>}
        </div>
        <div className="event-results-meta"><span><strong>{filteredEvents.length}</strong> {filteredEvents.length === 1 ? "opportunity" : "opportunities"} {hasFilters ? "match your filters" : "to explore"}</span><span>DEMO LISTINGS / {filteredEvents.length.toString().padStart(2, "0")}</span></div>
        {activeFilters.length > 0 && <div className="event-active-filters" aria-label="Active filters">{activeFilters.map((filter) => <button key={filter.label} type="button" onClick={filter.clear}>{filter.label}<X size={12} /></button>)}</div>}
        {filteredEvents.length ? <div className="event-discovery-grid">
          {filteredEvents.map((event) => <EventCard key={event.id} event={event} dashboard={dashboard} onBookmark={(item) => toggleBookmark(dashboard, updateDashboard, notify, item)} />)}
        </div> : <div className="event-empty-state"><span><Search size={22} /></span><h3>{savedOnly && !dashboard.bookmarks.length ? "No saved events yet." : "No opportunities found."}</h3><p>{savedOnly && !dashboard.bookmarks.length ? "Bookmark an event to keep it close. Saved items will appear here." : "Try another search or clear a filter to see more of the sample board."}</p><button className="button button-outline" type="button" onClick={clearAll}>Clear search and filters</button></div>}
      </section>
    </div>
  );
}

function RegistrationDialog({ event, profile, onClose, onRegister }) {
  const dialogRef = useRef(null);
  const [teamName, setTeamName] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (event && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [event]);
  if (!event) return null;

  const closeDialog = () => {
    dialogRef.current?.close();
    onClose();
  };
  const submit = (submissionEvent) => {
    submissionEvent.preventDefault();
    if (event.teamSize.min > 1 && !teamName.trim()) {
      setError("Enter a demo team name to continue.");
      return;
    }
    if (!acknowledged) {
      setError("Confirm that you meet the sample eligibility requirements.");
      return;
    }
    onRegister(teamName.trim());
  };
  const handleClose = () => onClose();

  return (
    <dialog className="event-dialog event-registration-dialog" ref={dialogRef} onClose={handleClose} onCancel={(cancelEvent) => { cancelEvent.preventDefault(); closeDialog(); }} aria-labelledby="registration-dialog-title">
      <button className="event-dialog-close" type="button" onClick={closeDialog} aria-label="Close registration dialog"><X size={19} /></button>
      <span className="dash-eyebrow">SIMULATED REGISTRATION / DEMO</span>
      <h2 id="registration-dialog-title">Join {event.title}</h2>
      <p className="event-dialog-disclosure">This action is stored only in this browser. No registration is sent to a real organizer.</p>
      <form className="event-registration-form" onSubmit={submit}>
        {event.teamSize.max > 1 && <label className="feature-field"><span>Team name {event.teamSize.min > 1 ? "(required)" : "(optional)"}</span><input value={teamName} onChange={(inputEvent) => setTeamName(inputEvent.target.value)} maxLength={50} placeholder="e.g. Small Steps Lab" /></label>}
        <div className="event-eligibility-note"><ShieldCheck size={17} /><span><strong>Sample eligibility</strong><small>{event.eligibility}</small></span></div>
        <label className="event-consent"><input type="checkbox" checked={acknowledged} onChange={(inputEvent) => setAcknowledged(inputEvent.target.checked)} /><span>I confirm I meet the sample eligibility requirements.</span></label>
        {error && <p className="feature-inline-error" role="alert">{error}</p>}
        <div className="event-dialog-actions"><button className="button button-purple" type="submit">Confirm demo registration <ArrowRight size={15} /></button><button type="button" className="button button-outline" onClick={closeDialog}>Cancel</button></div>
      </form>
    </dialog>
  );
}

function createRegistration(event, profile, teamName) {
  const registeredAt = new Date();
  const registrationId = `REG-DEMO-${registeredAt.getTime().toString(36).toUpperCase()}`;
  const self = { id: `${registrationId}-member-1`, name: profile.name, role: "Team lead", skills: [...profile.skills] };
  const members = [self];
  for (let index = 1; index < event.teamSize.min; index += 1) {
    members.push({ id: `${registrationId}-member-${index + 1}`, name: `Demo teammate ${index}`, role: "Sample teammate", skills: ["Teamwork"] });
  }
  const roundProgress = Object.fromEntries(event.rounds.map((round) => [round.id, round.initialStatus === "completed" ? "completed" : "locked"]));
  const firstRound = event.rounds[0];
  if (firstRound) roundProgress[firstRound.id] = new Date(firstRound.startsAt) <= registeredAt ? "active" : "upcoming";
  return {
    id: registrationId,
    eventId: event.id,
    registeredAt: registeredAt.toISOString(),
    status: "registered",
    isSample: false,
    team: { id: `TEAM-${registrationId}`, name: teamName || profile.name, leader: profile.name, members },
    currentRoundId: firstRound?.id ?? "",
    roundProgress,
    submission: { title: "", description: "", repositoryUrl: "", liveDemoUrl: "", reference: "", roundId: event.rounds[0]?.id ?? "", status: "draft", submittedAt: "" },
    readAnnouncements: [],
    result: null,
  };
}

export function EventDetailsPage() {
  const { eventId } = useParams();
  const { dashboard, updateDashboard, notify } = useDashboard();
  const navigate = useNavigate();
  const [showRegistration, setShowRegistration] = useState(false);
  const registrationTriggerRef = useRef(null);
  const registrationWasOpenRef = useRef(false);
  useEffect(() => {
    if (showRegistration) {
      registrationWasOpenRef.current = true;
      return;
    }
    if (registrationWasOpenRef.current) {
      registrationWasOpenRef.current = false;
      registrationTriggerRef.current?.focus();
    }
  }, [showRegistration]);
  const closeRegistration = () => setShowRegistration(false);
  const event = eventCatalog.find((item) => item.id === eventId);
  const registration = event && getEventRegistration(dashboard, event.id);
  if (!event) {
    return <section className="event-not-found"><span className="dash-eyebrow">EVENT NOT FOUND</span><h1>This sample listing isn’t here.</h1><p>Choose an event from the current demo board.</p><Link className="button button-purple" to="/app/events"><ArrowLeft size={15} /> Back to events</Link></section>;
  }
  const availability = eventAvailability(event, registration);
  const bookmarked = dashboard.bookmarks.includes(event.id);
  const ModeIcon = modeIcon(event.mode);
  const register = (teamName) => {
    if (getEventRegistration(dashboard, event.id)) {
      setShowRegistration(false);
      notify("You already have a local demo registration for this event.");
      return;
    }
    const nextRegistration = createRegistration(event, dashboard.profile, teamName);
    const occurredAt = new Date();
    const next = {
      ...dashboard,
      registrations: [nextRegistration, ...dashboard.registrations],
      activityLog: appendActivityLog(dashboard, {
        id: `event-registration-${nextRegistration.id}`,
        type: "event_registered",
        title: `Registered for ${event.title}`,
        eventId: event.id,
        occurredAt: occurredAt.toISOString(),
        localDate: getLocalDateKey(occurredAt),
        source: "local",
        isDemo: true,
      }),
    };
    if (updateDashboard(next)) {
      setShowRegistration(false);
      notify(`Demo registration saved. ID: ${nextRegistration.id}`);
      navigate(`/app/events/${event.id}/hub`);
    }
  };

  return (
    <div className="event-page event-detail-page">
      <Link to="/app/events" className="event-back-link"><ArrowLeft size={15} /> Back to Discover Events</Link>
      <header className="event-detail-hero">
        <div className="event-detail-main-copy">
          <div className="event-detail-tags"><span className="event-category-tag">{event.category}</span><EventStatus tone={availability.toLowerCase()}>{availability}</EventStatus><span className="sample-chip">SAMPLE EVENT</span></div>
          <span className="dash-eyebrow">ORGANIZED BY {event.organizer.name.toUpperCase()}</span>
          <h1>{event.title}<span>.</span></h1>
          <p>{event.fullDescription}</p>
          <div className="event-detail-hero-actions">
            {registration ? <Link className="button button-purple" to={`/app/events/${event.id}/hub`}>Open Event Hub <ArrowRight size={15} /></Link>
              : availability === "Open" ? <button className="button button-purple" type="button" onClick={(event) => { registrationTriggerRef.current = event.currentTarget; setShowRegistration(true); }}>Register for this event <ArrowRight size={15} /></button>
                : <button className="button button-purple" type="button" disabled>Registration closed</button>}
            <button type="button" className={`button button-outline event-detail-bookmark${bookmarked ? " is-saved" : ""}`} aria-pressed={bookmarked} onClick={() => toggleBookmark(dashboard, updateDashboard, notify, event)}><Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} /> {bookmarked ? "Saved" : "Save event"}</button>
          </div>
          <span className="event-demo-truth"><Info size={14} /> Sample event only. Registration and participation are simulated locally.</span>
        </div>
        <div className="event-detail-side-card"><span className="dash-eyebrow">KEY DATES / DEMO</span><div><small>REGISTRATION CLOSES</small><strong>{formatDateTime(event.registrationDeadline)}</strong></div><div><small>EVENT WINDOW</small><strong>{formatDate(event.startsAt)} — {formatDate(event.endsAt)}</strong></div><div><small>TEAM SIZE</small><strong>{event.teamSize.min}–{event.teamSize.max} participants</strong></div><div><small>FORMAT</small><strong><ModeIcon size={14} /> {event.mode}</strong></div></div>
      </header>
      <div className="event-detail-columns">
        <div className="event-detail-content">
          <section className="event-content-section"><span className="dash-eyebrow">01 / THE PROMPT</span><h2>What you’ll explore</h2><p>{event.fullDescription}</p><div className="event-organizer-card"><span className="organizer-monogram">CC</span><span><small>DEMO ORGANIZER</small><strong>{event.organizer.name}</strong><em>{event.organizer.type}</em></span><span className="sample-chip">FICTIONAL</span></div></section>
          <section className="event-content-section"><span className="dash-eyebrow">02 / WHO CAN JOIN</span><h2>Eligibility & guidelines</h2><p>{event.eligibility}</p><ul className="event-rules-list">{event.rules.map((rule) => <li key={rule}><Check size={15} />{rule}</li>)}</ul></section>
          <section className="event-content-section"><span className="dash-eyebrow">03 / THE JOURNEY</span><h2>Event timeline</h2><ol className="event-mini-timeline">{event.rounds.map((round, index) => <li key={round.id}><span className="timeline-index">{String(index + 1).padStart(2, "0")}</span><div><strong>{round.name}</strong><p>{round.description}</p><small>{formatDate(round.startsAt)} — due {formatDate(round.deadlineAt)}</small></div></li>)}</ol></section>
          {!!event.prizes.length && <section className="event-content-section"><span className="dash-eyebrow">04 / RECOGNITION</span><h2>Sample recognitions</h2><ul className="event-prize-list">{event.prizes.map((prize) => <li key={prize}><Medal size={16} />{prize}</li>)}</ul><p className="panel-disclaimer">Illustrative recognitions only; no prize is offered or issued.</p></section>}
        </div>
        <aside className="event-detail-aside"><section className="event-aside-panel"><span className="dash-eyebrow">AT A GLANCE</span><h2>One idea at a time.</h2><dl><div><dt>Mode</dt><dd>{event.mode}</dd></div><div><dt>Difficulty</dt><dd>{event.difficulty}</dd></div><div><dt>Category</dt><dd>{event.category}</dd></div><div><dt>Participants</dt><dd>{event.teamSize.min} to {event.teamSize.max}</dd></div></dl><Link className="event-aside-link" to="/app/my-events">See your events <ArrowRight size={14} /></Link></section><div className="event-aside-disclaimer"><Info size={15} /><p>CampusCode is a frontend-only prototype. This sample listing is not managed by a real organizer.</p></div></aside>
      </div>
      <RegistrationDialog event={showRegistration ? event : null} profile={dashboard.profile} onClose={closeRegistration} onRegister={register} />
    </div>
  );
}

const eventTabs = [
  ["overview", "Overview"], ["rounds", "Rounds"], ["team", "My Team"], ["submission", "Submissions"],
  ["results", "Results"], ["leaderboard", "Leaderboard"], ["certificate", "Certificate"], ["announcements", "Announcements"],
];

function getRoundStatus(registration, round) {
  const status = registration.roundProgress?.[round.id];
  return status || round.initialStatus || "locked";
}

function updateRegistration(dashboard, registration, changes) {
  const registrations = dashboard.registrations.map((item) => item.id === registration.id ? { ...item, ...changes } : item);
  return { ...dashboard, registrations };
}

function markRoundSubmitted(event, registration, roundId) {
  const roundProgress = { ...registration.roundProgress, [roundId]: "submitted" };
  const currentIndex = event.rounds.findIndex((round) => round.id === roundId);
  const nextRound = event.rounds[currentIndex + 1];
  if (nextRound) {
    const activeStatus = new Date(nextRound.startsAt) <= new Date() ? "active" : "upcoming";
    roundProgress[nextRound.id] = activeStatus;
  }
  return {
    roundProgress,
    currentRoundId: nextRound?.id ?? roundId,
  };
}

function HubOverview({ event, registration, dashboard, navigateTab }) {
  const currentRound = event.rounds.find((round) => round.id === registration.currentRoundId);
  const nextDeadline = currentRound?.deadlineAt;
  const unread = event.announcements.filter((announcement) => !registration.readAnnouncements?.includes(announcement.id)).length;
  const steps = ["Registration", "Team", "Round", "Submission", "Results", "Certificate"];
  const progressIndex = registration.status === "completed" ? steps.length - 1 : Math.max(0, event.rounds.findIndex((round) => round.id === registration.currentRoundId) + 1);
  return (
    <div className="event-hub-overview">
      <div className="hub-overview-grid">
        <section className="hub-panel hub-next-panel"><span className="dash-eyebrow">YOUR NEXT STEP</span><h2>{currentRound?.name ?? "Event complete"}</h2><p>{currentRound?.description ?? "This sample event has ended. Review its example results and feedback."}</p><div className="hub-next-meta"><span><Clock3 size={14} /> {nextDeadline ? `Due ${formatDateTime(nextDeadline)}` : "No upcoming deadline"}</span><EventStatus tone={registration.status === "completed" ? "completed" : "open"}>{registration.status === "completed" ? "Completed" : getRoundStatus(registration, currentRound ?? {})}</EventStatus></div><button type="button" className="button button-purple" onClick={() => navigateTab(registration.status === "completed" ? "results" : "submission")}>{registration.status === "completed" ? "View sample results" : "Open submission workspace"} <ArrowRight size={15} /></button></section>
        <section className="hub-panel hub-registration-panel"><span className="dash-eyebrow">DEMO REGISTRATION</span><strong className="hub-registration-id">{registration.id}</strong><span>Saved {formatDate(registration.registeredAt)} · {registration.isSample ? "sample record" : "this device"}</span><div className="hub-team-summary"><Users size={15} /><span>{registration.team.name}<small>{registration.team.members.length} sample member{registration.team.members.length === 1 ? "" : "s"}</small></span></div></section>
      </div>
      <section className="hub-panel hub-progress-panel"><div className="feature-panel-heading"><div><span className="dash-eyebrow">PARTICIPATION PATH</span><h2>One milestone at a time.</h2></div><span className="sample-chip">DEMO TRACKER</span></div><ol className="hub-journey">{steps.map((step, index) => <li key={step} className={index <= progressIndex ? "is-done" : ""}><span>{index < progressIndex ? <Check size={14} /> : index + 1}</span><small>{step}</small></li>)}</ol><p className="panel-disclaimer">Milestones reflect this local sample record, not a submission to an organizer.</p></section>
      <div className="hub-overview-grid">
        <section className="hub-panel"><div className="feature-panel-heading"><div><span className="dash-eyebrow">ROUND IN FOCUS</span><h2>{currentRound?.name ?? "Event wrapped"}</h2></div><button className="text-action" type="button" onClick={() => navigateTab("rounds")}>All rounds <ArrowRight size={13} /></button></div>{currentRound ? <><p className="hub-copy">{currentRound.description}</p><span className="hub-deadline"><CalendarDays size={14} /> {formatDate(currentRound.deadlineAt)}</span></> : <p className="hub-copy">Explore the example event timeline and results.</p>}</section>
        <section className="hub-panel"><div className="feature-panel-heading"><div><span className="dash-eyebrow">EVENT UPDATES</span><h2>{unread ? `${unread} to read` : "All caught up"}</h2></div><button className="text-action" type="button" onClick={() => navigateTab("announcements")}>View updates <ArrowRight size={13} /></button></div>{event.announcements.slice(0, 2).map((announcement) => <div className="hub-announcement-preview" key={announcement.id}><span className={`priority-mark priority-${announcement.priority}`} /><span><strong>{announcement.title}</strong><small>{formatDate(announcement.occurredAt)}</small></span></div>)}{!event.announcements.length && <p className="hub-copy">No sample announcements for this event.</p>}</section>
      </div>
    </div>
  );
}

function HubRounds({ event, registration, saveRegistration }) {
  return <section className="hub-panel hub-rounds-panel"><div className="feature-panel-heading"><div><span className="dash-eyebrow">ROUND BY ROUND</span><h2>Event timeline</h2></div><span className="sample-chip">SAMPLE SCHEDULE</span></div><ol className="hub-round-list">{event.rounds.map((round, index) => {
    const status = getRoundStatus(registration, round);
    return <li className={`hub-round hub-round-${status}`} key={round.id}><span className="hub-round-marker">{status === "completed" || status === "submitted" ? <Check size={15} /> : index + 1}</span><div className="hub-round-content"><div className="hub-round-heading"><div><span className="dash-eyebrow">ROUND {String(index + 1).padStart(2, "0")}</span><h3>{round.name}</h3></div><EventStatus tone={status === "active" ? "open" : status === "completed" || status === "submitted" ? "completed" : "neutral"}>{status.replace("-", " ")}</EventStatus></div><p>{round.description}</p><div className="hub-round-dates"><span><small>STARTS</small>{formatDate(round.startsAt)}</span><span><small>DEADLINE</small>{formatDate(round.deadlineAt)}</span></div><details><summary>Requirements</summary><ul>{round.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul></details>{status === "active" && registration.status !== "completed" && <button type="button" className="text-action" onClick={() => saveRegistration(markRoundSubmitted(event, registration, round.id))}>Mark round as submitted <ArrowRight size={13} /></button>}</div></li>;
  })}</ol><p className="panel-disclaimer">Round statuses are local demo values and do not indicate review by an organizer.</p></section>;
}

function HubTeam({ event, registration, saveRegistration, notify }) {
  const [teamName, setTeamName] = useState(registration.team.name);
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [error, setError] = useState("");
  const team = registration.team;
  const addMember = (submitEvent) => {
    submitEvent.preventDefault();
    if (!memberName.trim() || !memberRole.trim()) {
      setError("Enter a sample member name and role.");
      return;
    }
    if (team.members.length >= event.teamSize.max) {
      setError("This sample team is at capacity.");
      return;
    }
    const member = { id: `member-${Date.now()}`, name: memberName.trim(), role: memberRole.trim(), skills: ["Sample skill"] };
    saveRegistration({ team: { ...team, members: [...team.members, member] } });
    setMemberName("");
    setMemberRole("");
    setError("");
    notify("Sample teammate added locally. No invitation was sent.");
  };
  const removeMember = (member) => {
    if (member.name === team.leader || team.members.length <= event.teamSize.min) {
      setError("The team lead stays on the team, and the minimum team size must be respected.");
      return;
    }
    saveRegistration({ team: { ...team, members: team.members.filter((item) => item.id !== member.id) } });
    setError("");
  };
  const saveTeamName = (submitEvent) => {
    submitEvent.preventDefault();
    if (!teamName.trim()) {
      setError("Team name can’t be empty.");
      return;
    }
    saveRegistration({ team: { ...team, name: teamName.trim() } });
    setError("");
    notify("Team name saved on this device.");
  };
  return <div className="hub-team-layout"><section className="hub-panel"><div className="feature-panel-heading"><div><span className="dash-eyebrow">TEAM DETAILS</span><h2>{team.name}</h2></div><span className="sample-chip">{team.members.length} / {event.teamSize.max} MEMBERS</span></div><form className="hub-team-name-form" onSubmit={saveTeamName}><label className="feature-field"><span>Team name</span><input value={teamName} onChange={(inputEvent) => setTeamName(inputEvent.target.value)} maxLength={50} /></label><button className="button button-outline" type="submit">Save name</button></form><dl className="hub-team-facts"><div><dt>Team ID</dt><dd>{team.id}</dd></div><div><dt>Team leader</dt><dd>{team.leader}</dd></div><div><dt>Team size rule</dt><dd>{event.teamSize.min}–{event.teamSize.max} members</dd></div></dl><p className="panel-disclaimer">Team edits are local examples. No member invitations or collaboration service exists.</p></section><section className="hub-panel"><div className="feature-panel-heading"><div><span className="dash-eyebrow">TEAM ROSTER</span><h2>People & roles</h2></div></div><ul className="hub-member-list">{team.members.map((member) => <li key={member.id}><span className="member-avatar">{member.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><span className="member-copy"><strong>{member.name}</strong><small>{member.role}</small><em>{member.skills.join(" · ")}</em></span>{member.name !== team.leader && <button type="button" className="icon-action" aria-label={`Remove ${member.name}`} onClick={() => removeMember(member)}><X size={15} /></button>}</li>)}</ul>{team.members.length < event.teamSize.max && <form className="hub-add-member-form" onSubmit={addMember}><label className="feature-field"><span>Sample member name</span><input value={memberName} onChange={(inputEvent) => setMemberName(inputEvent.target.value)} /></label><label className="feature-field"><span>Role</span><input value={memberRole} onChange={(inputEvent) => setMemberRole(inputEvent.target.value)} /></label><button className="button button-outline" type="submit">Add sample member <Users size={14} /></button></form>}{error && <p className="feature-inline-error" role="alert">{error}</p>}</section></div>;
}

function validHttpUrl(value) {
  if (!value) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function HubSubmission({ event, registration, saveRegistration, notify }) {
  const [form, setForm] = useState(registration.submission);
  const [error, setError] = useState("");
  const round = event.rounds.find((item) => item.id === (registration.submission.roundId || registration.currentRoundId));
  const deadlinePassed = round?.deadlineAt && new Date(round.deadlineAt) < new Date();
  const submitted = registration.submission.status === "submitted";
  const roundStatus = round ? getRoundStatus(registration, round) : "locked";
  const canSubmit = roundStatus === "active" || roundStatus === "submitted";
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const save = (submitEvent) => {
    submitEvent.preventDefault();
    const shouldSubmit = submitEvent.nativeEvent.submitter?.value === "submit";
    if (deadlinePassed) {
      setError("This sample round’s deadline has passed. The submission is read-only.");
      return;
    }
    if (!form.title.trim() || !form.description.trim()) {
      setError("Add a project title and description before saving.");
      return;
    }
    if (!validHttpUrl(form.repositoryUrl.trim()) || !validHttpUrl(form.liveDemoUrl.trim())) {
      setError("Repository and demo links must be valid http:// or https:// URLs.");
      return;
    }
    if (shouldSubmit && !canSubmit) {
      setError("This round is not active yet. You can save a draft and submit when the round opens.");
      return;
    }
    const nextSubmission = {
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      repositoryUrl: form.repositoryUrl.trim(),
      liveDemoUrl: form.liveDemoUrl.trim(),
      reference: form.reference.trim(),
      roundId: round?.id ?? "",
      status: shouldSubmit ? "submitted" : "draft",
      submittedAt: shouldSubmit ? new Date().toISOString() : registration.submission.submittedAt,
    };
    const roundChanges = shouldSubmit && round
      ? markRoundSubmitted(event, registration, round.id)
      : {};
    if (!saveRegistration(
      { submission: nextSubmission, ...roundChanges },
      shouldSubmit
        ? "Sample submission saved on this device. Nothing was sent to an organizer."
        : "Draft saved on this device.",
    )) return;
    setError("");
    setForm(nextSubmission);
  };
  return (
    <div className="hub-submission-layout">
      <section className="hub-panel">
        <div className="feature-panel-heading">
          <div><span className="dash-eyebrow">ROUND SUBMISSION / LOCAL ONLY</span><h2>{submitted ? "Your demo submission." : "Shape the idea."}</h2></div>
          <EventStatus tone={submitted ? "completed" : deadlinePassed ? "closed" : "neutral"}>{submitted ? "Saved locally" : deadlinePassed ? "Deadline passed" : registration.submission.status === "draft" ? "Draft" : "Not started"}</EventStatus>
        </div>
        <form className="hub-submission-form" onSubmit={save}>
          <label className="feature-field"><span>Submission title *</span><input value={form.title} onChange={(inputEvent) => update("title", inputEvent.target.value)} disabled={deadlinePassed} maxLength={100} /></label>
          <label className="feature-field"><span>Project description *</span><textarea rows={5} value={form.description} onChange={(inputEvent) => update("description", inputEvent.target.value)} disabled={deadlinePassed} maxLength={1200} /></label>
          <label className="feature-field"><span>Repository URL <small>(optional)</small></span><input type="text" inputMode="url" placeholder="https://github.com/…" value={form.repositoryUrl} onChange={(inputEvent) => update("repositoryUrl", inputEvent.target.value)} disabled={deadlinePassed} /></label>
          <label className="feature-field"><span>Live demo URL <small>(optional)</small></span><input type="text" inputMode="url" placeholder="https://…" value={form.liveDemoUrl} onChange={(inputEvent) => update("liveDemoUrl", inputEvent.target.value)} disabled={deadlinePassed} /></label>
          <label className="feature-field"><span>Document reference <small>(optional; no file upload)</small></span><input value={form.reference} onChange={(inputEvent) => update("reference", inputEvent.target.value)} disabled={deadlinePassed} maxLength={120} /></label>
          {error && <p className="feature-inline-error" role="alert">{error}</p>}
          <div className="event-dialog-actions">
            <button className="button button-outline" type="submit" value="draft" disabled={deadlinePassed}>Save draft</button>
            <button className="button button-purple" type="submit" value="submit" disabled={deadlinePassed || !canSubmit}>{submitted ? "Update local submission" : "Submit demo work"} <ArrowRight size={15} /></button>
          </div>
        </form>
        <p className="panel-disclaimer">This prototype stores text fields only. It does not upload files or deliver work to an organizer. Deadline enforcement is a local demo check.</p>
        {submitted && <p className="hub-submitted-note"><Check size={15} /> Saved {formatDateTime(registration.submission.submittedAt)}</p>}
      </section>
      <aside className="hub-panel hub-deadline-aside"><span className="dash-eyebrow">SUBMISSION ROUND</span><h3>{round?.name ?? "No active round"}</h3><p>{round?.description ?? "There is no current round in this event record."}</p><div className="hub-deadline"><Clock3 size={15} /> {round?.deadlineAt ? `Deadline ${formatDateTime(round.deadlineAt)}` : "No deadline"}</div><EventStatus tone={roundStatus === "active" ? "open" : roundStatus === "submitted" ? "completed" : "neutral"}>{roundStatus}</EventStatus></aside>
    </div>
  );
}

function HubResults({ event, registration }) {
  const results = registration.result ?? event.results;
  return <section className="hub-panel"><div className="feature-panel-heading"><div><span className="dash-eyebrow">REVIEW / SAMPLE DATA</span><h2>Round results</h2></div><span className="sample-chip">NOT OFFICIAL</span></div>{results ? <div className="hub-results-grid"><div className="hub-result-score"><small>DEMO SCORE</small><strong>{results.score ?? "—"}<span>/ 100</span></strong></div><div><span className="dash-eyebrow">QUALIFICATION</span><h3>{results.qualification ?? "Not announced"}</h3><p>{results.feedback ?? "No sample feedback is available yet."}</p></div><div className="hub-final-result"><span className="dash-eyebrow">FINAL RESULT</span><strong>{results.finalResult ?? "Pending"}</strong></div></div> : <div className="event-empty-state compact"><span><Clock3 size={20} /></span><h3>Results aren’t available yet.</h3><p>This sample event has no result data to show. No judging or review has happened.</p></div>}</section>;
}

function HubLeaderboard({ event }) {
  return <section className="hub-panel"><div className="feature-panel-heading"><div><span className="dash-eyebrow">EXAMPLE TEAMS / SIMULATED</span><h2>Progress, not pressure.</h2></div><span className="sample-chip">ILLUSTRATIVE</span></div>{event.leaderboard.length ? <div className="hub-leaderboard"><div className="leaderboard-head"><span>RANK</span><span>TEAM</span><span>SCORE</span><span>PROGRESS</span></div>{event.leaderboard.map((team, index) => <div className="leaderboard-row" key={team.id}><span className="leaderboard-rank">{String(index + 1).padStart(2, "0")}</span><strong>{team.teamName}</strong><span>{team.score}</span><span className="leaderboard-progress"><i><b style={{ width: `${team.progress}%` }} /></i><small>{team.progress}%</small></span></div>)}</div> : <div className="event-empty-state compact"><span><Users size={20} /></span><h3>No sample ranking for this event.</h3><p>This fictional event doesn’t include leaderboard examples.</p></div>}<p className="panel-disclaimer">These fictional rows are not real participants, rankings, or competition results.</p></section>;
}

function HubCertificate({ event, registration, profile, dashboard }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  useEffect(() => {
    if (open && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [open]);
  const certificate = getCertificateRecords(dashboard).find((item) => item.eventId === event.id);
  return <section className="hub-panel"><div className="feature-panel-heading"><div><span className="dash-eyebrow">PARTICIPATION RECORD / PREVIEW</span><h2>Sample certificate</h2></div><span className="sample-chip">NOT VALID</span></div>{certificate ? <div className="hub-certificate-card"><span className="certificate-icon"><Medal size={19} /></span><div><span className="dash-eyebrow">SAMPLE COMPLETION</span><h3>{certificate.title}</h3><p>{certificate.participantName} · {formatDate(certificate.issueDate)} · Preview concept only</p></div><button type="button" className="button button-outline" onClick={() => setOpen(true)}>Preview certificate <ArrowUpRight size={14} /></button><Link className="text-action" to="/app/certificates">View collection</Link></div> : <div className="event-empty-state compact"><span><Medal size={20} /></span><h3>Completion comes first.</h3><p>A sample certificate preview becomes available after the event timeline ends.</p></div>}<dialog className="certificate-dialog" ref={dialogRef} onClose={() => setOpen(false)} onCancel={(eventObject) => { eventObject.preventDefault(); dialogRef.current?.close(); }} aria-label="Sample event certificate preview"><div className="certificate-preview"><span className="certificate-stamp">SAMPLE · NOT VALID</span><span className="dash-eyebrow">CAMPUSCODE / PARTICIPATION PREVIEW</span><h2>{certificate?.type}</h2><p>This sample preview is not an issued or verifiable certificate.</p><strong>{certificate?.title}</strong><span className="certificate-name">{certificate?.participantName ?? profile.name}</span><span className="certificate-date">Sample completion date · {certificate ? formatDate(certificate.issueDate) : "not available"}</span><button type="button" className="button button-purple" onClick={() => dialogRef.current?.close()}>Close preview</button></div></dialog></section>;
}

function HubAnnouncements({ event, registration, saveRegistration, notify }) {
  const markRead = (id) => {
    if (registration.readAnnouncements?.includes(id)) return;
    saveRegistration({ readAnnouncements: [...(registration.readAnnouncements ?? []), id] });
    notify("Announcement marked as read on this device.");
  };
  return <section className="hub-panel"><div className="feature-panel-heading"><div><span className="dash-eyebrow">ORGANIZER NOTES / EXAMPLES</span><h2>Announcements</h2></div><span className="sample-chip">LOCAL DEMO</span></div>{event.announcements.length ? <div className="hub-announcement-list">{event.announcements.map((announcement) => {
    const read = registration.readAnnouncements?.includes(announcement.id);
    return <article className={`hub-announcement${read ? " is-read" : ""}`} key={announcement.id}><span className={`priority-mark priority-${announcement.priority}`} /><div><div className="hub-announcement-title"><h3>{announcement.title}</h3>{!read && <span className="sample-chip">UNREAD</span>}</div><p>{announcement.message}</p><small>{formatDateTime(announcement.occurredAt)} · Sample message</small></div><button className="text-action" type="button" disabled={read} onClick={() => markRead(announcement.id)}>{read ? "Read" : "Mark read"}</button></article>;
  })}</div> : <div className="event-empty-state compact"><span><Info size={20} /></span><h3>No announcements.</h3><p>There are no sample notes attached to this event.</p></div>}<p className="panel-disclaimer">These example messages are not delivered by an organizer.</p></section>;
}

export function EventHubPage() {
  const { eventId } = useParams();
  const { dashboard, updateDashboard, notify } = useDashboard();
  const [tab, setTab] = useState("overview");
  const event = eventCatalog.find((item) => item.id === eventId);
  const registration = event && getEventRegistration(dashboard, event.id);
  if (!event) return <section className="event-not-found"><span className="dash-eyebrow">EVENT NOT FOUND</span><h1>We can’t find that event hub.</h1><Link className="button button-purple" to="/app/events">Back to events</Link></section>;
  if (!registration) return <section className="event-not-found"><span className="dash-eyebrow">REGISTRATION REQUIRED</span><h1>Join this sample event first.</h1><p>The Event Hub is available for events with a local demo registration.</p><Link className="button button-purple" to={`/app/events/${event.id}`}>View event details</Link></section>;
  const saveRegistration = (changes, message = "Event Hub changes saved on this device.") => {
    const submissionTransition = changes.submission &&
      ["submitted", "under_review"].includes(changes.submission.status) &&
      !["submitted", "under_review"].includes(registration.submission.status);
    const roundTransition = Object.entries(changes.roundProgress ?? {}).some(([roundId, status]) =>
      status === "submitted" && registration.roundProgress[roundId] !== "submitted");
    let nextState = updateRegistration(dashboard, registration, changes);
    if (submissionTransition || roundTransition) {
      const occurredAt = new Date();
      const activity = recordQualifyingActivity(nextState, {
        id: `event-submission-${registration.id}-${occurredAt.getTime()}`,
        type: "event_submission",
        title: `Submitted work for ${event.title}`,
        entityId: event.id,
        log: false,
        occurredAt,
      });
      nextState = {
        ...activity.state,
        activityLog: appendActivityLog(activity.state, {
          id: `event-submission-log-${registration.id}-${occurredAt.getTime()}`,
          type: "event_submission",
          title: `Submitted work for ${event.title}`,
          eventId: event.id,
          occurredAt: occurredAt.toISOString(),
          localDate: getLocalDateKey(occurredAt),
          source: "local",
          isDemo: true,
        }),
      };
    }
    const saved = updateDashboard(nextState);
    if (saved) notify(message);
    return saved;
  };
  const currentRound = event.rounds.find((round) => round.id === registration.currentRoundId);
  const TabContent = {
    overview: <HubOverview event={event} registration={registration} dashboard={dashboard} navigateTab={setTab} />,
    rounds: <HubRounds event={event} registration={registration} saveRegistration={saveRegistration} />,
    team: <HubTeam event={event} registration={registration} saveRegistration={saveRegistration} notify={notify} />,
    submission: <HubSubmission event={event} registration={registration} saveRegistration={saveRegistration} notify={notify} />,
    results: <HubResults event={event} registration={registration} />,
    leaderboard: <HubLeaderboard event={event} />,
    certificate: <HubCertificate event={event} registration={registration} profile={dashboard.profile} dashboard={dashboard} />,
    announcements: <HubAnnouncements event={event} registration={registration} saveRegistration={saveRegistration} notify={notify} />,
  }[tab];
  return <div className="event-page event-hub-page">
    <Link to="/app/my-events" className="event-back-link"><ArrowLeft size={15} /> My Events</Link>
    <header className="event-hub-header"><div><span className="dash-eyebrow">EVENT HUB / DEMO REGISTRATION</span><h1>{event.title}<span>.</span></h1><p>{event.organizer.name} · {registration.team.name} · ID {registration.id}</p></div><div className="event-hub-header-actions"><EventStatus tone={getRegistrationStatus(registration)}>{getRegistrationStatus(registration).replace("-", " ")}</EventStatus><Link className="button button-outline" to={`/app/events/${event.id}`}>Event details <ArrowUpRight size={14} /></Link></div></header>
    <div className="event-hub-disclosure"><Info size={15} /><span>Frontend demo only · team details, submissions, announcements, and results are local examples—not organizer communications.</span></div>
    <div className="event-hub-tabs-wrap"><div className="event-hub-tabs" role="tablist" aria-label="Event Hub sections">{eventTabs.map(([key, label]) => <button key={key} id={`hub-tab-${key}`} type="button" role="tab" aria-selected={tab === key} aria-controls="hub-tab-panel" tabIndex={tab === key ? 0 : -1} onClick={() => setTab(key)}>{label}{key === "announcements" && event.announcements.some((item) => !registration.readAnnouncements?.includes(item.id)) && <i aria-label="Unread announcements" />}</button>)}</div></div>
    <section id="hub-tab-panel" role="tabpanel" aria-labelledby={`hub-tab-${tab}`} className="event-hub-content" key={tab} tabIndex={0}>{TabContent}</section>
    <p className="event-hub-footnote">CURRENT ROUND: {currentRound?.name ?? "No active round"} · Local sample data stays in this browser.</p>
  </div>;
}

function registrationNextDeadline(registration, event) {
  const currentRound = event.rounds.find((round) => round.id === registration.currentRoundId);
  return currentRound?.deadlineAt ?? event.registrationDeadline;
}

function MyEventCard({ registration, event, dashboard, onBookmark }) {
  const status = getRegistrationStatus(registration);
  const currentRound = event.rounds.find((round) => round.id === registration.currentRoundId);
  const completedRounds = event.rounds.filter((round) => ["completed", "submitted"].includes(getRoundStatus(registration, round))).length;
  const progress = event.rounds.length ? Math.round((completedRounds / event.rounds.length) * 100) : 0;
  return <article className="my-event-card"><div className="my-event-card-top"><span className="event-category-tag">{event.category}</span><EventStatus tone={status}>{status.replace("-", " ")}</EventStatus></div><h3>{event.title}</h3><p className="my-event-organizer">{event.organizer.name} · {event.mode} · {registration.isSample ? "Sample registration" : "Local demo registration"}</p><div className="my-event-registration-id"><span>REGISTRATION ID</span><strong>{registration.id}</strong><span>REGISTERED {formatDate(registration.registeredAt)}</span></div><div className="my-event-team"><Users size={14} /><span><strong>{registration.team.name}</strong><small>{registration.team.members.length} sample member{registration.team.members.length === 1 ? "" : "s"}</small></span></div><div className="my-event-progress-heading"><span>{currentRound?.name ?? "Event complete"}</span><span>{progress}% journey</span></div><div className="goal-track" role="progressbar" aria-label={`${event.title} event progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div><div className="my-event-next-deadline"><small>NEXT DATE</small><strong>{formatDateTime(registrationNextDeadline(registration, event))}</strong></div><div className="my-event-actions"><Link className="button button-purple" to={`/app/events/${event.id}/hub`}>Open Event Hub <ArrowRight size={15} /></Link><button className={`event-bookmark${dashboard.bookmarks.includes(event.id) ? " is-saved" : ""}`} type="button" aria-label={`${dashboard.bookmarks.includes(event.id) ? "Remove bookmark from" : "Bookmark"} ${event.title}`} aria-pressed={dashboard.bookmarks.includes(event.id)} onClick={() => onBookmark(event)}><Bookmark size={16} fill={dashboard.bookmarks.includes(event.id) ? "currentColor" : "none"} /></button></div></article>;
}

function SavedOpportunityCard({ event, dashboard, onBookmark }) {
  const registration = getEventRegistration(dashboard, event.id);
  return (
    <article className="my-event-card saved-opportunity-card">
      <div className="my-event-card-top"><span className="event-category-tag">{event.category}</span><EventStatus tone={registration ? "registered" : eventAvailability(event).toLowerCase()}>{registration ? "Registered too" : eventAvailability(event)}</EventStatus></div>
      <h3>{event.title}</h3>
      <p className="my-event-organizer">{event.organizer.name} · {event.mode} · Saved on this device</p>
      <p className="saved-opportunity-description">{event.description}</p>
      <div className="my-event-next-deadline"><small>REGISTRATION CLOSES</small><strong>{formatDate(event.registrationDeadline)}</strong></div>
      <div className="my-event-actions"><Link className="button button-purple" to={`/app/events/${event.id}`}>View opportunity <ArrowRight size={15} /></Link><button className="event-bookmark is-saved" type="button" aria-label={`Remove bookmark from ${event.title}`} aria-pressed="true" onClick={() => onBookmark(event)}><Bookmark size={16} fill="currentColor" /></button></div>
    </article>
  );
}

export function MyEventsPage() {
  const { dashboard, updateDashboard, notify } = useDashboard();
  const [filter, setFilter] = useState("all");
  const registrations = dashboard.registrations.map((registration) => ({
    registration,
    event: eventCatalog.find((item) => item.id === registration.eventId),
    status: getRegistrationStatus(registration),
  })).filter((item) => item.event);
  const active = registrations.filter((item) => item.status === "in-progress").length;
  const completed = registrations.filter((item) => item.status === "completed").length;
  const upcomingDeadlines = registrations.filter(({ registration, event, status }) => status !== "completed" && status !== "cancelled" && new Date(registrationNextDeadline(registration, event)) >= new Date()).length;
  const filters = [["all", "All"], ["upcoming", "Upcoming"], ["in-progress", "In Progress"], ["completed", "Completed"], ["cancelled", "Cancelled"], ["saved", "Saved"]];
  const filtered = registrations.filter(({ registration, event, status }) => filter === "all" ||
    (filter === "saved" ? dashboard.bookmarks.includes(event.id) : status === filter));
  const savedEvents = eventCatalog.filter((event) => dashboard.bookmarks.includes(event.id));
  const onBookmark = (event) => toggleBookmark(dashboard, updateDashboard, notify, event);
  const hasVisibleEvents = filter === "saved" ? savedEvents.length > 0 : filtered.length > 0;

  return <div className="event-page my-events-page">
    <header className="my-events-header"><div><span className="dash-eyebrow">YOUR OPPORTUNITY LOG</span><h1>My Events<span>.</span></h1><p>Keep registrations, deadlines, and saved opportunities together in your local workspace.</p></div><Link className="button button-purple" to="/app/events">Discover events <ArrowRight size={15} /></Link></header>
    <div className="event-summary-grid"><article><span>REGISTRATIONS</span><strong>{registrations.length}</strong><small>Including labeled sample records</small></article><article><span>IN PROGRESS</span><strong>{active}</strong><small>Based on sample event dates</small></article><article><span>UPCOMING DATES</span><strong>{upcomingDeadlines}</strong><small>Local timeline reminders</small></article><article><span>COMPLETED</span><strong>{completed}</strong><small>Example event records</small></article></div>
    <div className="my-events-section-heading"><div><span className="dash-eyebrow">PARTICIPATION TRACKER</span><h2>Every step, in view.</h2></div><Link className="event-quiet-link" to="/app/events"><Search size={14} /> Find another challenge</Link></div>
    <div className="my-events-tabs" role="tablist" aria-label="Filter My Events">{filters.map(([key, label]) => <button key={key} type="button" role="tab" aria-selected={filter === key} onClick={() => setFilter(key)}>{label}{key === "saved" && <span>{savedEvents.length}</span>}</button>)}</div>
    {filter === "saved" && <p className="saved-events-note"><Bookmark size={14} /> Saved events are bookmarks; they are separate from registrations.</p>}
    {hasVisibleEvents ? <div className="my-events-grid">{filter === "saved"
      ? savedEvents.map((event) => <SavedOpportunityCard key={event.id} event={event} dashboard={dashboard} onBookmark={onBookmark} />)
      : filtered.map(({ registration, event }) => <MyEventCard key={registration.id} registration={registration} event={event} dashboard={dashboard} onBookmark={onBookmark} />)}</div>
      : <div className="event-empty-state"><span>{filter === "saved" ? <Bookmark size={22} /> : <CalendarDays size={22} />}</span><h3>{filter === "saved" ? "No saved events in this view." : filter === "all" ? "Your event list is ready when you are." : `No ${filter.replace("-", " ")} events.`}</h3><p>{filter === "saved" ? "Save an opportunity from Discover Events and it will appear here." : "Browse the illustrative event board and register locally to begin a demo timeline."}</p><Link className="button button-purple" to="/app/events">{filter === "saved" ? "Discover opportunities" : "Explore sample events"} <ArrowRight size={15} /></Link></div>}
    <section className="saved-events-strip"><div><span className="dash-eyebrow">BOOKMARKS / NOT REGISTRATIONS</span><h2>Saved for later <span>{savedEvents.length}</span></h2></div>{savedEvents.length ? <div className="saved-event-links">{savedEvents.map((event) => <Link key={event.id} to={`/app/events/${event.id}`}><Bookmark size={14} fill="currentColor" />{event.title}<ArrowUpRight size={13} /></Link>)}</div> : <p>Bookmark events to create your shortlist on this device.</p>}</section>
  </div>;
}
