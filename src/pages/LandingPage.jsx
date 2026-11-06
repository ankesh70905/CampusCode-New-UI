import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  Blocks,
  BookOpenCheck,
  Code2,
  Compass,
  Layers3,
  Lightbulb,
  MoveUpRight,
  PanelsTopLeft,
  Route,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader.jsx";
import EventCard from "../components/EventCard.jsx";
import EventDialog from "../components/EventDialog.jsx";
import SiteFooter from "../components/SiteFooter.jsx";
import { featuredEvents } from "../data/events.js";

const journey = [
  { number: "01", title: "Find your prompt", copy: "Browse opportunities that match your curiosity.", icon: Compass },
  { number: "02", title: "Take your place", copy: "Keep event details and next steps in one view.", icon: Route },
  { number: "03", title: "Make something", copy: "Turn a rough idea into a project you can share.", icon: Lightbulb },
  { number: "04", title: "Show your work", copy: "Prepare, submit, and learn through the challenge.", icon: Code2 },
  { number: "05", title: "Keep the proof", copy: "Track progress and celebrate milestones along the way.", icon: Award },
];

const features = [
  { title: "Opportunity finder", copy: "Search a curated-style set of sample opportunities by interest and format.", icon: Compass, tag: "DISCOVER" },
  { title: "Your student space", copy: "Keep saved events and next steps together in your local student workspace.", icon: PanelsTopLeft, tag: "ORGANIZE" },
  { title: "Event tracking", copy: "Keep dates, round details, and your own participation status in view.", icon: Route, tag: "STAY ON TRACK" },
  { title: "Project workspace", copy: "Give works-in-progress a home alongside the challenges that inspired them.", icon: Layers3, tag: "MAKE" },
  { title: "Milestones", copy: "A personal view of goals and progress, designed to encourage steady practice.", icon: Award, tag: "GROW" },
  { title: "Certificate previews", copy: "Preview a future certificate experience; no real certificates are issued here.", icon: BookOpenCheck, tag: "REFLECT" },
];

const ideas = [
  { label: "A campus wayfinding tool", field: "ACCESS / CONCEPT", icon: Route, tone: "idea-lilac" },
  { label: "A repair-first kit for student projects", field: "CLIMATE / CONCEPT", icon: Blocks, tone: "idea-lime" },
  { label: "A quieter way to find your people", field: "COMMUNITY / CONCEPT", icon: UsersRound, tone: "idea-peach" },
];

function useRevealSections() {
  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.12 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

function HeroArtwork() {
  return (
    <div className="hero-art reveal" role="img" aria-label="Illustration of an idea prompt orbiting in a purple field">
      <div className="art-topline">
        <span>THE IDEA FIELD</span>
        <span>NO. 026 / OPEN</span>
      </div>
      <div className="art-orbit orbit-one" />
      <div className="art-orbit orbit-two" />
      <div className="art-sun"><span>MAKE<br />A MARK</span></div>
      <span className="art-spark spark-one">✳</span>
      <span className="art-spark spark-two">+</span>
      <div className="art-note">
        <span className="mono-label">A PROMPT FOR WHAT'S NEXT</span>
        <strong>What could<br />work better?</strong>
        <span className="art-note-arrow"><ArrowUpRight size={18} /></span>
      </div>
      <div className="art-bottomline">
        <span>IDEAS START HERE</span>
        <span className="art-index">CC—01</span>
      </div>
    </div>
  );
}

export default function LandingPage() {
  useRevealSections();
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero-section page-wrap" id="top">
          <div className="hero-copy">
            <div className="hero-kicker reveal"><span className="kicker-dot" />A PLACE TO BEGIN</div>
            <h1 className="hero-title reveal">
              YOUR IDEAS<br />
              DESERVE AN<br />
              <span>ARENA<span className="title-period">.</span></span>
            </h1>
            <p className="hero-description reveal">
              Discover opportunities, compete in hackathons, build projects and turn your ideas into something real.
            </p>
            <div className="hero-actions reveal">
              <a className="button button-purple" href="#events">
                Explore events <ArrowUpRight size={17} />
              </a>
              <Link className="button button-outline" to="/register">
                Join CampusCode <ArrowRight size={17} />
              </Link>
            </div>
            <div className="hero-footnote reveal">
              <span className="footnote-mark">↘</span>
              <span>For the curious, the builders,<br />and the “what if?” people.</span>
            </div>
          </div>
          <HeroArtwork />
          <a className="hero-scroll" href="#events">
            <span>SCROLL TO EXPLORE</span><ArrowDown size={14} />
          </a>
        </section>

        <section className="events-section section-pad" id="events">
          <div className="page-wrap">
            <div className="section-heading events-heading reveal">
              <div>
                <span className="eyebrow"><span className="eyebrow-slash">//</span> THE OPPORTUNITY BOARD</span>
                <h2>Find a challenge.<br /><span>Find your people.</span></h2>
              </div>
              <p>Every big idea needs a first deadline. Start with a prompt that gets your wheels turning.</p>
            </div>
            <div className="sample-banner reveal">
              <span className="sample-banner-icon">i</span>
              <span>Illustrative event concepts — not live listings or open registrations.</span>
              <span className="mono-label">DEMO CONTENT</span>
            </div>
            <div className="event-grid">
              {featuredEvents.map((event, index) => (
                <EventCard key={event.id} event={event} index={index} onExplore={setSelectedEvent} />
              ))}
            </div>
            <div className="events-bottom reveal">
              <span>YOUR NEXT OPEN TAB COULD BE YOUR NEXT BIG THING.</span>
              <a href="#how-it-works">See how it works <ArrowDown size={15} /></a>
            </div>
          </div>
        </section>

        <section className="journey-section section-pad" id="how-it-works">
          <div className="page-wrap">
            <div className="journey-intro reveal">
              <span className="eyebrow"><span className="eyebrow-slash">//</span> FROM “WHAT IF” TO “WHAT'S NEXT”</span>
              <h2>A good idea<br />likes a <em>little momentum.</em></h2>
              <p>One step at a time. CampusCode is designed to help you keep moving from a spark of curiosity to a project you can put your name on.</p>
            </div>
            <div className="journey-list">
              {journey.map(({ number, title, copy, icon: Icon }, index) => (
                <article className="journey-step reveal" style={{ "--delay": `${index * 75}ms` }} key={number}>
                  <span className="journey-number">{number}</span>
                  <span className="journey-icon"><Icon size={20} strokeWidth={1.7} /></span>
                  <div className="journey-copy"><h3>{title}</h3><p>{copy}</p></div>
                  {index < journey.length - 1 && <span className="journey-connector" aria-hidden="true" />}
                </article>
              ))}
            </div>
            <div className="journey-note reveal">
              <span className="note-star">✳</span>
              <p><strong>No perfect plan required.</strong> Start small. Learn in public. Let the next step reveal itself.</p>
              <a href="#features" aria-label="Explore platform features"><MoveUpRight size={19} /></a>
            </div>
          </div>
        </section>

        <section className="features-section section-pad" id="features">
          <div className="page-wrap">
            <div className="features-head reveal">
              <div>
                <span className="eyebrow"><span className="eyebrow-slash">//</span> YOUR IDEA'S TOOLKIT</span>
                <h2>Less juggling.<br /><span>More making.</span></h2>
              </div>
              <p>A student workspace for saved opportunities, local progress, and project notes, so the focus stays on the idea.</p>
            </div>
            <div className="feature-layout">
              <div className="feature-aside reveal">
                <div className="feature-aside-stamp"><span>CC</span><i>✳</i></div>
                <span className="mono-label">BUILT AROUND YOUR NEXT STEP</span>
                <p>Discover the opportunity. Keep the details close. Spend your energy on the idea.</p>
                <a href="#community">See the bigger picture <ArrowUpRight size={15} /></a>
              </div>
              <div className="feature-list">
                {features.map(({ title, copy, icon: Icon, tag }, index) => (
                  <article className="feature-row reveal" style={{ "--delay": `${index * 65}ms` }} key={title}>
                    <span className="feature-icon"><Icon size={20} strokeWidth={1.7} /></span>
                    <div className="feature-text">
                      <span className="feature-tag">{tag}</span>
                      <h3>{title}</h3>
                      <p>{copy}</p>
                    </div>
                    <span className="feature-arrow" aria-hidden="true"><ArrowUpRight size={19} /></span>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="community-section section-pad" id="community">
          <div className="page-wrap community-wrap">
            <div className="community-copy reveal">
              <span className="eyebrow"><span className="eyebrow-slash">//</span> GOOD IDEAS ARE A TEAM SPORT</span>
              <h2>Make room<br />for <span>what could be.</span></h2>
              <p>Somewhere between a notebook sketch and a finished demo, an idea needs space to grow. CampusCode is a starting point for students to explore challenges, make things, and learn from the process.</p>
              <a className="text-link" href="#about">A little more about us <ArrowUpRight size={17} /></a>
              <span className="community-disclaimer">Concept examples below are illustrative—not real student projects or testimonials.</span>
            </div>
            <div className="idea-stack" aria-label="Illustrative student project concepts">
              <div className="stack-label mono-label">IMAGINED HERE / MADE YOURS</div>
              {ideas.map(({ label, field, icon: Icon, tone }, index) => (
                <article className={`idea-card ${tone} reveal`} style={{ "--delay": `${index * 110}ms` }} key={label}>
                  <div className="idea-card-top"><span>{field}</span><span>CONCEPT 0{index + 1}</span></div>
                  <div className="idea-card-main"><span className="idea-icon"><Icon size={21} /></span><h3>{label}</h3><ArrowUpRight size={17} /></div>
                  <div className="idea-card-bottom"><span>AN IDEA IN PROGRESS</span><span className="idea-progress"><i /></span></div>
                </article>
              ))}
              <span className="stack-spark" aria-hidden="true">✳</span>
            </div>
          </div>
        </section>

        <section className="about-strip" id="about">
          <div className="page-wrap about-inner reveal">
            <span className="about-symbol" aria-hidden="true">///</span>
            <p>CampusCode is a platform concept for student innovation—connecting curious minds with challenges, tools, and room to grow.</p>
            <span className="mono-label">BUILT FOR THE NEXT IDEA</span>
          </div>
        </section>

        <section className="final-cta">
          <div className="cta-shape cta-shape-one" aria-hidden="true" />
          <div className="cta-shape cta-shape-two" aria-hidden="true" />
          <div className="page-wrap cta-content reveal">
            <span className="eyebrow"><span className="eyebrow-slash">//</span> YOUR MOVE</span>
            <h2>YOUR NEXT BIG IDEA<br />STARTS <span>HERE.</span></h2>
            <p>Bring the question you can't stop thinking about. We'll help you find a place to start.</p>
            <div className="cta-actions">
              <Link className="button button-lime" to="/register">Join CampusCode <ArrowUpRight size={17} /></Link>
              <a className="button button-light-outline" href="#events">Explore events <ArrowRight size={17} /></a>
            </div>
            <div className="cta-foot"><span>START BEFORE YOU FEEL READY.</span><span>CC / 2026</span></div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <EventDialog event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </>
  );
}
