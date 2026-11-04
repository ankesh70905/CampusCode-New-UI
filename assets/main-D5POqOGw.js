(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=`23456789ABCDEFGHJKLMNPQRSTUVWXYZ`;function t(){let t=new Uint8Array(5);return crypto.getRandomValues(t),Array.from(t,t=>e[t%32]).join(``)}function n(e){return e.replace(/[<>&'"]/g,e=>({"<":`&lt;`,">":`&gt;`,"&":`&amp;`,"'":`&apos;`,'"':`&quot;`})[e])}function r(){return`
    <div class="form-field captcha-field">
      <div class="form-field__label-row">
        <label class="form-label" for="captcha-answer">CAPTCHA</label>
        <span class="form-hint">LOCAL DEMO ONLY</span>
      </div>
      <div class="captcha-challenge">
        <output class="captcha-code" aria-label="CAPTCHA code"></output>
        <button class="captcha-refresh" type="button" aria-label="Generate a new CAPTCHA">↻ NEW</button>
      </div>
      <input id="captcha-answer" name="captcha" type="text" placeholder="Enter the code above" autocomplete="off" required>
    </div>
  `}function i(e){let r=e.querySelector(`.captcha-code`),i=e.closest(`form`)?.querySelector(`[name="captcha"]`);if(!r)return;let a=t();r.innerHTML=`
    <svg viewBox="0 0 220 54" role="img" aria-label="CAPTCHA challenge">
      <rect x="1" y="1" width="218" height="52" rx="8" fill="var(--color-surface-soft)" stroke="var(--color-border)"/>
      <path d="M12 43 204 10M8 16l194 26M30 50 181 4" stroke="var(--color-primary)" stroke-opacity=".42" stroke-width="2"/>
      <text x="110" y="37" text-anchor="middle" fill="var(--color-text)" font-family="Inter, sans-serif" font-size="29" font-weight="600" letter-spacing="7">${n(a)}</text>
    </svg>
  `,i&&(i.dataset.expected=a,i.value=``)}function a(e,t,n=`error`){let r=e.querySelector(`.auth-feedback`);r&&(r.className=`auth-feedback auth-feedback--${n}`,r.textContent=t,r.hidden=!1)}function o(e){let t=e.elements.namedItem(`captcha`);return t?.value.trim()?t.value.trim().toUpperCase()===t.dataset.expected?``:`CAPTCHA code does not match. Please try again.`:`Please enter the CAPTCHA code.`}function s(e){let t=e.elements.namedItem(`email`);return t?.value.trim()&&t.validity.valid}function c(e){let t=e.elements.namedItem(`email`),n=e.elements.namedItem(`password`);return!t.value.trim()||!n.value?`Please enter your email and password.`:t.validity.valid?o(e):`Please enter a valid email address.`}function l(e){let t=e.elements.namedItem(`name`),n=e.elements.namedItem(`email`),r=e.elements.namedItem(`password`),i=e.elements.namedItem(`confirmPassword`),a=e.elements.namedItem(`ageConfirmed`);return!t.value.trim()||!n.value.trim()||!r.value||!i.value?`Please fill in all required fields.`:n.validity.valid?r.value===i.value?a.checked?o(e):`Please confirm that you are 18 years of age or older.`:`Your passwords do not match.`:`Please enter a valid email address.`}function u(e){let t=e.dataset.resetTemplate;if(!t){console.error(`Password reset form template is unavailable.`);return}let n=e.querySelector(`[data-login-content]`);n?(n.innerHTML=decodeURIComponent(t),d(n)):console.error(`Login form container is unavailable.`)}function d(e){e.querySelectorAll(`.captcha-field`).forEach(e=>{i(e)})}function f(e){e.addEventListener(`click`,t=>{let n=t.target.closest(`[data-password-toggle]`);if(!n)return;let r=e.querySelector(`#${CSS.escape(n.dataset.passwordToggle)}`);if(!r){console.error(`Password field "${n.dataset.passwordToggle}" was not found.`);return}let i=r.type===`password`;r.type=i?`text`:`password`,n.setAttribute(`aria-pressed`,String(i)),n.setAttribute(`aria-label`,`${i?`Hide`:`Show`} password`),n.innerHTML=`<span aria-hidden="true">${i?`◉`:`○`}</span> ${i?`HIDE`:`SHOW`}`})}function p(e,t){e.addEventListener(`click`,e=>{let n=e.target.closest(`.captcha-refresh`);n&&i(n.closest(`.captcha-field`)),e.target.closest(`[data-show-reset]`)&&u(t),e.target.closest(`[data-show-login]`)&&window.location.reload()}),e.addEventListener(`submit`,e=>{let t=e.target.closest(`[data-auth-form]`);if(!t)return;if(e.preventDefault(),!s(t)){let e=t.elements.namedItem(`email`);if(e?.value.trim()&&!e.validity.valid){a(t,`Please enter a valid email address.`),e.focus();return}}let n=``;t.dataset.authForm===`login`&&(n=c(t)),t.dataset.authForm===`register`&&(n=l(t)),t.dataset.authForm===`reset`&&(n=t.elements.namedItem(`email`).value.trim()?t.elements.namedItem(`email`).validity.valid?o(t):`Please enter a valid email address.`:`Please enter your email address.`),n?(a(t,n),t.querySelector(`:invalid`)?.focus()):a(t,t.dataset.authForm===`login`?`Demo only: sign-in is unavailable because no authentication service is connected. Your credentials were not sent.`:t.dataset.authForm===`register`?`Demo only: account creation is unavailable because no registration service is connected. Your information was not sent.`:`Demo only: password reset is unavailable because no email service is connected. No reset email was sent.`,`info`)}),f(e),d(e)}function m(){let e=document.querySelector(`.auth-main`),t=document.querySelector(`.auth-card__content`);e&&t&&p(t,e)}function h(){let e=document.querySelector(`.experience-play`),t=document.querySelector(`.experience-frame`);if(!e||!t)return;let n=n=>{t.classList.toggle(`is-playing`,n),e.setAttribute(`aria-pressed`,String(n)),e.setAttribute(`aria-label`,`${n?`Pause`:`Play`} motion preview`),e.querySelector(`.experience-play__icon`).textContent=n?`Ⅱ`:`▶`,e.querySelector(`.experience-play__label`).textContent=n?`PAUSE PREVIEW`:`PLAY PREVIEW`};e.addEventListener(`click`,()=>{n(e.getAttribute(`aria-pressed`)!==`true`)}),`IntersectionObserver`in window&&new IntersectionObserver(([e])=>{e.isIntersecting||n(!1)},{threshold:.15}).observe(t)}var g=[`.about__copy`,`.orbit-art`,`.experience__heading`,`.section-heading`,`.step-card`,`.arena-row`,`.mission h2`,`.community__top`,`.cta h2`,`.site-footer__main`,`.auth-card-wrap`];function _(){if(window.matchMedia(`(prefers-reduced-motion: reduce)`).matches)return;let e=document.querySelectorAll(g.join(`,`));if(!e.length||!(`IntersectionObserver`in window))return;document.documentElement.classList.add(`motion-ready`,`app-ready`);let t=new Map;e.forEach(e=>{if(e.dataset.reveal=``,e.matches(`.step-card, .arena-row`)){let n=e.matches(`.step-card`)?`steps`:`arena`,r=t.get(n)||0;e.style.setProperty(`--reveal-delay`,`${Math.min(r*70,280)}ms`),t.set(n,r+1)}});let n=new IntersectionObserver((e,t)=>{e.forEach(e=>{e.isIntersecting&&(e.target.classList.add(`is-visible`),t.unobserve(e.target))})},{threshold:.12,rootMargin:`0px 0px -36px 0px`});e.forEach(e=>n.observe(e))}function v(e,t){e.setAttribute(`aria-expanded`,`false`),e.setAttribute(`aria-label`,`Open navigation menu`),e.querySelector(`span`).textContent=`☰`,t.hidden=!0}function y(){let e=document.querySelector(`.menu-toggle`),t=document.querySelector(`.mobile-menu`);e&&t&&(e.addEventListener(`click`,()=>{let n=e.getAttribute(`aria-expanded`)===`true`;e.setAttribute(`aria-expanded`,String(!n)),e.setAttribute(`aria-label`,n?`Open navigation menu`:`Close navigation menu`),e.querySelector(`span`).textContent=n?`☰`:`×`,t.hidden=n}),document.addEventListener(`click`,n=>{t.hidden||t.contains(n.target)||e.contains(n.target)||v(e,t)}),document.addEventListener(`keydown`,n=>{n.key===`Escape`&&!t.hidden&&(v(e,t),e.focus())}),document.addEventListener(`click`,n=>{let r=n.target.closest(`[data-scroll-to]`);if(!r)return;let i=document.getElementById(r.dataset.scrollTo);i?(i.scrollIntoView({behavior:window.matchMedia(`(prefers-reduced-motion: reduce)`).matches?`auto`:`smooth`}),t.hidden||v(e,t)):console.error(`Navigation target "${r.dataset.scrollTo}" was not found.`)}))}function b(){let e=document.querySelector(`.hero`);if(!e)return;let t=e.querySelector(`.hero__progress i`),n=e.querySelector(`.hero__progress`),r=0,i=()=>{r=0;let e=Math.max(1,document.documentElement.scrollHeight-window.innerHeight),i=Math.min(1,Math.max(0,window.scrollY/e)),a=Math.round(i*100);t.style.width=`${a}%`,n.setAttribute(`aria-valuenow`,String(a))},a=()=>{r||=window.requestAnimationFrame(i)};window.addEventListener(`scroll`,a,{passive:!0}),window.addEventListener(`resize`,a),i()}var x=`campuscode-theme`;function S(e,t=!0){let n=e===`dark`?`dark`:`light`;if(document.documentElement.dataset.theme=n,document.querySelector(`meta[name="theme-color"]`)?.setAttribute(`content`,n===`dark`?`#0a171e`:`#f3f6f7`),document.querySelectorAll(`[data-theme-toggle]`).forEach(e=>{let t=n===`dark`?`light`:`dark`;e.setAttribute(`aria-label`,`Switch to ${t} theme`),e.setAttribute(`aria-pressed`,String(n===`dark`));let r=e.querySelector(`.theme-toggle__label`);r&&(r.textContent=t===`dark`?`Dark`:`Light`)}),t)try{localStorage.setItem(x,n)}catch(e){console.error(`Unable to save the CampusCode theme preference.`,e)}}function C(){S(document.documentElement.dataset.theme===`dark`?`dark`:`light`,!1),document.addEventListener(`click`,e=>{e.target.closest(`[data-theme-toggle]`)&&S(document.documentElement.dataset.theme===`dark`?`light`:`dark`)})}function w({link:e=!0}={}){let t=`
    <span class="brand__slashes" aria-hidden="true">
      <i></i><i></i><i></i>
    </span>
    <span class="brand__copy">
      <strong>CAMPUSCODE</strong>
      <small>HACKATHON ARENA</small>
    </span>
  `;return e?`<a class="brand" href="/campuscode-dashboard/" aria-label="CampusCode home">${t}</a>`:`<div class="brand" aria-label="CampusCode">${t}</div>`}var T=[{title:`EXPLORE`,links:[[`About`,`#about`],[`Workflow`,`#how`],[`Challenge themes`,`#hackathons`],[`Community`,`#community`]]},{title:`ACCOUNT`,links:[[`Registration preview`,`register/`],[`Sign in`,`login/`],[`Contact`,`mailto:campuscode@gmail.com`]]}];function E(e,t){return`<a href="${t.startsWith(`#`)||t.startsWith(`mailto:`)?t:`/campuscode-dashboard/${t}`}">${e}</a>`}function D(){let e=T.map(({title:e,links:t})=>`
        <section class="footer-group" aria-label="${e}">
          <h2>${e}</h2>
          <ul>${t.map(([e,t])=>`<li>${E(e,t)}</li>`).join(``)}</ul>
        </section>`).join(``);return`
    <footer class="site-footer" id="footer">
      <div class="site-footer__main">
        <div class="site-footer__identity">
          ${w({link:!1})}
          <p>A frontend preview for a student hackathon platform.<br>No backend is connected; form data is not sent.</p>
        </div>
        <div class="site-footer__groups">${e}</div>
      </div>
      <div class="site-footer__bottom">
        <span>© 2026 CAMPUSCODE</span>
      </div>
    </footer>
  `}function O(){return`
    <footer class="auth-footer">
      <span>CAMPUSCODE © 2026</span>
      <span>PREVIEW ONLY · NO ACCOUNT SERVICE CONNECTED</span>
    </footer>
  `}var k=[[`ABOUT`,`about`],[`HOW IT WORKS`,`how`],[`HACKATHONS`,`hackathons`],[`COMMUNITY`,`community`]];function A(e=``){return`
    <button class="theme-toggle ${e}" type="button" data-theme-toggle aria-label="Switch to dark theme">
      <svg class="theme-toggle__sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>
      <svg class="theme-toggle__moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.1A8.5 8.5 0 0 1 8.9 3.8 8.6 8.6 0 1 0 20.2 15.1Z"/></svg>
      <span class="theme-toggle__label">Dark</span>
    </button>
  `}function j(){let e=k.map(([e,t])=>`<button class="site-nav__link" type="button" data-scroll-to="${t}">${e}</button>`).join(``),t=`/campuscode-dashboard/register/`,n=`/campuscode-dashboard/login/`;return`
    <header class="site-header">
      ${w()}
      <nav class="site-nav" aria-label="Main navigation">${e}</nav>
      <div class="site-header__actions">
        <a class="site-header__login" href="${n}">LOGIN</a>
        ${A()}
        <a class="button button--outline site-header__join" href="${t}">ACCOUNT PREVIEW <span aria-hidden="true">↗</span></a>
      </div>
      <a class="site-header__mobile-login" href="${n}">LOGIN</a>
      ${A(`site-header__theme`)}
      <button class="menu-toggle" type="button" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-menu">
        <span aria-hidden="true">☰</span>
      </button>
      <nav class="mobile-menu" id="mobile-menu" aria-label="Mobile navigation" hidden>
        ${k.map(([e,t])=>`<button class="mobile-menu__link" type="button" data-scroll-to="${t}">${e}</button>`).join(``)}
        <a class="button button--outline mobile-menu__join" href="${t}">ACCOUNT PREVIEW <span aria-hidden="true">↗</span></a>
      </nav>
    </header>
  `}function M(){return`
    <header class="auth-header">
      ${w()}
      <div class="auth-header__actions">
        ${A()}
        <a class="auth-header__back" href="/campuscode-dashboard/">← BACK TO HOME</a>
      </div>
    </header>
  `}var N=[[`FIND A CHALLENGE`,`Explore hackathon themes that interest you.`],[`FIND A TEAM`,`Bring together people with different strengths.`],[`MAKE SOMETHING`,`Turn an idea into a working project.`],[`SHARE YOUR WORK`,`Present what your team has built.`]],P=[{category:`ARTIFICIAL INTELLIGENCE`,title:`AI INNOVATION`,description:`Ideas for useful, human-centered AI.`},{category:`WEB DEVELOPMENT`,title:`FUTURE WEB`,description:`Interfaces and tools for the open web.`},{category:`SMART TECHNOLOGY`,title:`CAMPUS TECH`,description:`Small ideas that improve campus life.`}];function F(e=`CC`,t=!1){return`
    <div class="orbit-art${t?` orbit-art--community`:``}" aria-hidden="true">
      <span class="orbit-art__ring orbit-art__ring--outer"></span>
      <span class="orbit-art__ring orbit-art__ring--middle"></span>
      <span class="orbit-art__ring orbit-art__ring--inner"></span>
      <span class="orbit-art__node orbit-art__node--one"></span>
      <span class="orbit-art__node orbit-art__node--two"></span>
      <span class="orbit-art__node orbit-art__node--three"></span>
      <span class="orbit-art__node orbit-art__node--four"></span>
      <strong>${e}</strong>
    </div>
  `}function I([e,t]){return`
    <article class="step-card">
      <h3>${e}</h3>
      <p>${t}</p>
    </article>
  `}function L({category:e,title:t,description:n}){return`
    <article class="arena-row">
      <div class="arena-row__title">
        <span>${e}</span>
        <h3>${t}</h3>
      </div>
      <p>${n}</p>
    </article>
  `}function R(){return`
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
  `}function z(){return`
    ${j()}
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
        ${F()}
      </section>

      <section class="experience" id="experience" aria-labelledby="experience-title">
        <div class="experience__heading">
          <h2 id="experience-title">BUILD<br>TOGETHER.</h2>
        </div>
        ${R()}
      </section>

      <section class="how section-pad" id="how" aria-labelledby="how-title">
        <div class="section-heading">
          <div><h2 id="how-title">A SIMPLE WORKFLOW</h2></div>
        </div>
        <div class="steps-grid" aria-label="A suggested hackathon workflow">${N.map(I).join(``)}</div>
      </section>

      <section class="arena section-pad" id="hackathons" aria-labelledby="arena-title">
        <div class="section-heading">
          <div><h2 id="arena-title">CHALLENGE THEMES</h2></div>
        </div>
        <p class="arena__disclosure">Illustrative themes only. No live hackathons are connected to this preview.</p>
        <div class="arena-list" id="arena-list">${P.map(L).join(``)}</div>
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
        ${F(`CC`,!0)}
        <p class="community__copy">Bring different skills to the same table.</p>
      </section>

      <section class="cta" aria-labelledby="cta-title">
        <div class="cta__circle" aria-hidden="true"></div>
        <h2 class="editorial-heading" id="cta-title"><span>YOUR NEXT</span><span class="type-outline">PROJECT</span><span>STARTS HERE.</span></h2>
        <a class="button button--dark" href="/campuscode-dashboard/register/">OPEN REGISTRATION PREVIEW <span aria-hidden="true">↗</span></a>
      </section>
    </main>
    ${D()}
  `}function B(e,t,n){return`
    <div class="auth-page auth-page--${n}">
      <div class="auth-page__backdrop" aria-hidden="true"></div>
      ${M()}
      <main class="auth-main">
        ${e}
        <section class="auth-card-wrap" aria-label="${n===`login`?`Sign in`:`Create account`}">
          <div class="auth-card">${t}</div>
        </section>
      </main>
      ${O()}
    </div>
  `}function V({title:e,description:t}){return`
    <section class="auth-intro">
      <h1>${e}</h1>
      <p class="auth-intro__description">${t}</p>
    </section>
  `}function H({eyebrow:e,title:t,description:n}){return`
    <div class="auth-card__header">
      <div>
        <span class="auth-card__eyebrow">${e}</span>
        <h2>${t}</h2>
        <p>${n}</p>
      </div>
    </div>
  `}function U(){return`
    ${H({eyebrow:`SIGN IN`,title:`LOGIN`,description:`Demo form. Nothing you enter is sent.`})}
    <form class="auth-form" data-auth-form="login" novalidate>
      <div class="form-field">
        <label class="form-label" for="login-email">EMAIL ADDRESS</label>
        <div class="input-shell"><span aria-hidden="true">@</span><input id="login-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required></div>
      </div>
      <div class="form-field">
        <label class="form-label" for="login-password">PASSWORD</label>
        <div class="input-shell"><span aria-hidden="true">•</span><input id="login-password" name="password" type="password" placeholder="Enter your password" autocomplete="current-password" required><button class="password-toggle" type="button" data-password-toggle="login-password" aria-label="Show password" aria-pressed="false"><span aria-hidden="true">○</span> SHOW</button></div>
      </div>
      ${r()}
      <div class="auth-feedback" role="alert" aria-live="polite" hidden></div>
      <button class="button button--dark auth-submit" type="submit">CHECK SIGN-IN FORM <span aria-hidden="true">↗</span></button>
      <button class="auth-text-button" type="button" data-show-reset>FORGOT PASSWORD?</button>
    </form>
    <div class="auth-card__switch"><span>DON'T HAVE AN ACCOUNT?</span><a href="/campuscode-dashboard/register/">CREATE ACCOUNT →</a></div>
  `}function W(){return`
    ${H({eyebrow:`PASSWORD RESET`,title:`RESET`,description:`Reset emails are unavailable in this preview.`})}
    <form class="auth-form" data-auth-form="reset" novalidate>
      <p class="reset-title">RESET YOUR <strong>PASSWORD</strong></p>
      <div class="form-field">
        <label class="form-label" for="reset-email">EMAIL ADDRESS</label>
        <div class="input-shell"><span aria-hidden="true">@</span><input id="reset-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required></div>
      </div>
      ${r()}
      <div class="auth-feedback" role="alert" aria-live="polite" hidden></div>
      <button class="button button--dark auth-submit" type="submit">CHECK RESET FORM <span aria-hidden="true">↗</span></button>
      <button class="auth-text-button" type="button" data-show-login>← BACK TO LOGIN</button>
    </form>
    <div class="auth-card__switch"><span>DON'T HAVE AN ACCOUNT?</span><a href="/campuscode-dashboard/register/">CREATE ACCOUNT →</a></div>
  `}function G(){return B(V({title:`Sign-in preview.`,description:`The sign-in service is not connected in this preview.`}),`<div class="auth-card__content" data-login-content>${U()}</div>`,`login`).replace(`<main class="auth-main">`,`<main class="auth-main" data-reset-template="${encodeURIComponent(W())}">`)}function K(){return`
    ${H({eyebrow:`CREATE ACCOUNT`,title:`REGISTER`,description:`Demo form. Nothing you enter is sent.`})}
    <form class="auth-form" data-auth-form="register" novalidate>
      <div class="form-field">
        <label class="form-label" for="register-name">FULL NAME</label>
        <div class="input-shell"><span aria-hidden="true">◇</span><input id="register-name" name="name" type="text" placeholder="Your full name" autocomplete="name" required></div>
      </div>
      <div class="form-field">
        <label class="form-label" for="register-email">EMAIL ADDRESS</label>
        <div class="input-shell"><span aria-hidden="true">@</span><input id="register-email" name="email" type="email" placeholder="you@example.com" autocomplete="email" required></div>
      </div>
      <div class="form-field">
        <label class="form-label" for="register-account-type">ACCOUNT TYPE</label>
        <div class="input-shell input-shell--disabled"><span aria-hidden="true">♟</span><input id="register-account-type" type="text" value="STUDENT" aria-label="Account type: student only" disabled></div>
        <p class="form-note">Organizer? Accounts are created by our team — contact <a href="mailto:campuscode@gmail.com">campuscode@gmail.com</a></p>
      </div>
      <div class="form-field">
        <label class="form-label" for="register-password">PASSWORD</label>
        <div class="input-shell"><span aria-hidden="true">•</span><input id="register-password" name="password" type="password" placeholder="Create a password" autocomplete="new-password" required><button class="password-toggle" type="button" data-password-toggle="register-password" aria-label="Show password" aria-pressed="false"><span aria-hidden="true">○</span> SHOW</button></div>
      </div>
      <div class="form-field">
        <label class="form-label" for="register-confirm">CONFIRM PASSWORD</label>
        <div class="input-shell"><span aria-hidden="true">•</span><input id="register-confirm" name="confirmPassword" type="password" placeholder="Repeat your password" autocomplete="new-password" required><button class="password-toggle" type="button" data-password-toggle="register-confirm" aria-label="Show password" aria-pressed="false"><span aria-hidden="true">○</span> SHOW</button></div>
      </div>
      ${r()}
      <label class="age-check"><input name="ageConfirmed" type="checkbox" required><span>I confirm that I am 18 years of age or older.</span></label>
      <div class="auth-feedback" role="alert" aria-live="polite" hidden></div>
      <button class="button button--dark auth-submit" type="submit">CHECK REGISTRATION FORM <span aria-hidden="true">↗</span></button>
    </form>
    <div class="auth-card__switch"><span>ALREADY HAVE AN ACCOUNT?</span><a href="/campuscode-dashboard/login/">LOGIN →</a></div>
  `}function q(){return B(V({title:`Registration preview.`,description:`Account creation is not connected in this preview.`}),`<div class="auth-card__content">${K()}</div>`,`register`)}var J=document.querySelector(`#app`),Y=`/campuscode-dashboard/`,X=(window.location.pathname.startsWith(Y)?window.location.pathname.slice(22-!!Y.endsWith(`/`)):window.location.pathname).replace(/\/+$/,``)||`/`;X===`/login`?(J.innerHTML=G(),document.title=`Login — CampusCode`,m()):X===`/register`?(J.innerHTML=q(),document.title=`Join CampusCode`,m()):(J.innerHTML=z(),document.title=`CampusCode — Hackathon Arena`,y(),b(),h()),C(),_();