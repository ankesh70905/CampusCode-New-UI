import { landingFooter } from '../components/footer.js';
import { landingHeader } from '../components/header.js';

const steps = [
  ['FIND A CHALLENGE', 'Explore hackathon themes that interest you.'],
  ['FIND A TEAM', 'Bring together people with different strengths.'],
  ['MAKE SOMETHING', 'Turn an idea into a working project.'],
  ['SHARE YOUR WORK', 'Present what your team has built.'],
];

const arenas = [
  {
    category: 'ARTIFICIAL INTELLIGENCE',
    title: 'AI INNOVATION',
    description: 'Ideas for useful, human-centered AI.',
  },
  {
    category: 'WEB DEVELOPMENT',
    title: 'FUTURE WEB',
    description: 'Interfaces and tools for the open web.',
  },
  {
    category: 'SMART TECHNOLOGY',
    title: 'CAMPUS TECH',
    description: 'Small ideas that improve campus life.',
  },
];

function orbitArtwork(label = 'CC', community = false) {
  return `
    <div class="orbit-art${community ? ' orbit-art--community' : ''}" aria-hidden="true">
      <span class="orbit-art__ring orbit-art__ring--outer"></span>
      <span class="orbit-art__ring orbit-art__ring--middle"></span>
      <span class="orbit-art__ring orbit-art__ring--inner"></span>
      <span class="orbit-art__node orbit-art__node--one"></span>
      <span class="orbit-art__node orbit-art__node--two"></span>
      <span class="orbit-art__node orbit-art__node--three"></span>
      <span class="orbit-art__node orbit-art__node--four"></span>
      <strong>${label}</strong>
    </div>
  `;
}

function stepCard([title, description]) {
  return `
    <article class="step-card">
      <h3>${title}</h3>
      <p>${description}</p>
    </article>
  `;
}

function arenaRow({ category, title, description }) {
  return `
    <article class="arena-row">
      <div class="arena-row__title">
        <span>${category}</span>
        <h3>${title}</h3>
      </div>
      <p>${description}</p>
    </article>
  `;
}

function videoStage() {
  return `
    <div class="experience-frame">
      <div class="experience-frame__top"><span>ANIMATED PREVIEW</span><span>CAMPUSCODE</span></div>
      <div class="experience-frame__visual" aria-hidden="true">
        <span class="experience-frame__orbit experience-frame__orbit--one"></span>
        <span class="experience-frame__orbit experience-frame__orbit--two"></span>
        <span class="experience-frame__glow"></span>
      </div>
      <button class="experience-play" type="button" aria-label="Play motion preview" aria-pressed="false">
        <span class="experience-play__icon" aria-hidden="true">▶</span>
        <span class="experience-play__label">PLAY PREVIEW</span>
      </button>
    </div>
  `;
}

export function homePage() {
  return `
    ${landingHeader()}
    <main>
      <section class="hero" id="top" aria-labelledby="hero-title">
        <div class="hero__art" aria-hidden="true">
          <svg class="hero__paths" viewBox="0 0 1440 950" preserveAspectRatio="none">
            <path d="M78 112C168 324 268 239 390 251s174 268 261 153 126-190 218-114 112 310 233 240 171-159 253-211 65-150 91-215"/>
            <path d="M-25 724C117 620 202 459 315 582s128 229 242 132 102-260 209-119 88 215 207 153 194-278 298-197 130 224 207 194"/>
            <path d="M341 953c17-179 147-251 203-375 60-133 4-293 92-356 91-66 207 96 242 201s77 123 143 84"/>
          </svg>
          <span class="hero__dot hero__dot--one"></span><span class="hero__dot hero__dot--two"></span>
          <span class="hero__dot hero__dot--three"></span><span class="hero__dot hero__dot--four"></span>
          <span class="hero__dot hero__dot--five"></span>
        </div>
        <div class="hero__eyebrow"><i></i>THE DIGITAL HOME FOR STUDENT INNOVATION</div>
        <span class="hero__location">CHENNAI · INDIA</span>
        <div class="hero__content">
          <h1 id="hero-title" aria-label="Build. Compete. Ship."><span data-word="BUILD">BUILD</span><span class="type-outline" data-word="COMPETE">COMPETE</span><span data-word="SHIP.">SHIP.</span></h1>
          <div class="hero__pitch">
            <p>Find a challenge. Build with a team. Share what you make.</p>
            <button class="button button--outline hero__explore" type="button" data-scroll-to="experience">
              SEE THE PREVIEW <span aria-hidden="true">↗</span>
            </button>
          </div>
        </div>
        <div class="hero__bottom">
          <span>SCROLL TO EXPLORE</span>
          <span class="hero__progress" role="progressbar" aria-label="Page reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></span>
        </div>
      </section>

      <section class="about section-pad" id="about" aria-labelledby="about-title">
        <div class="about__copy">
          <span class="mono-label section-eyebrow"><i></i>ABOUT CAMPUSCODE</span>
          <h2 class="editorial-heading" id="about-title"><span>WHERE</span><span>STUDENTS</span><span class="type-outline">BUILD.</span></h2>
          <p>CampusCode is a place for students to explore hackathon ideas, find collaborators and share what they build.</p>
        </div>
        ${orbitArtwork()}
      </section>

      <section class="experience" id="experience" aria-labelledby="experience-title">
        <div class="experience__heading">
          <h2 id="experience-title">BUILD<br>TOGETHER.</h2>
        </div>
        ${videoStage()}
      </section>

      <section class="how section-pad" id="how" aria-labelledby="how-title">
        <div class="section-heading">
          <div><h2 id="how-title">A SIMPLE WORKFLOW</h2></div>
        </div>
        <div class="steps-grid" aria-label="A suggested hackathon workflow">${steps.map(stepCard).join('')}</div>
      </section>

      <section class="arena section-pad" id="hackathons" aria-labelledby="arena-title">
        <div class="section-heading">
          <div><h2 id="arena-title">CHALLENGE THEMES</h2></div>
        </div>
        <p class="arena__disclosure">Illustrative themes only. No live hackathons are connected to this preview.</p>
        <div class="arena-list" id="arena-list">${arenas.map(arenaRow).join('')}</div>
      </section>

      <section class="mission section-pad" aria-labelledby="mission-title">
        <span class="mission__ghost" aria-hidden="true">CAMPUSCODE</span>
        <span class="mono-label mission__eyebrow">WHY WE BUILD</span>
        <h2 class="editorial-heading" id="mission-title"><span>GREAT</span><span>IDEAS</span><span class="type-outline">NEED BUILDERS.</span></h2>
        <p>A good idea grows when people have the space and support to build it together.</p>
      </section>

      <section class="community" id="community" aria-labelledby="community-title">
        <div class="community__top">
          <span class="mono-label">FIND YOUR PEOPLE</span>
          <h2 class="editorial-heading" id="community-title"><span>FIND</span><span>YOUR</span><span class="type-outline">PEOPLE.</span></h2>
        </div>
        ${orbitArtwork('CC', true)}
        <p class="community__copy">Bring different skills to the same table.</p>
      </section>

      <section class="cta" aria-labelledby="cta-title">
        <div class="cta__circle" aria-hidden="true"></div>
        <h2 class="editorial-heading" id="cta-title"><span>YOUR NEXT</span><span class="type-outline">PROJECT</span><span>STARTS HERE.</span></h2>
        <a class="button button--dark" href="${import.meta.env.BASE_URL}register/">OPEN REGISTRATION PREVIEW <span aria-hidden="true">↗</span></a>
      </section>
    </main>
    ${landingFooter()}
  `;
}
