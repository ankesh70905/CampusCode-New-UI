import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/brand.js";
import ThemeToggle from "./ThemeToggle.jsx";

export default function AuthLayout({ page, eyebrow, title, description, children }) {
  const isLogin = page === "login";

  return (
    <main className={`auth-page auth-page-${page}`}>
      <section className="auth-story" aria-label="CampusCode introduction">
        <Link className="auth-logo" to="/" aria-label="CampusCode home">
          <img src={logo} alt="CampusCode Hackathon Arena" />
        </Link>
        <Link className="auth-back" to="/">
          <ArrowLeft size={15} /> Back to home
        </Link>
        <div className="auth-story-copy">
          <span className="eyebrow"><span className="eyebrow-slash">//</span> {eyebrow}</span>
          <h2>{isLogin ? <>The next idea<br />could be <em>yours.</em></> : <>Make space<br />for <em>what if.</em></>}</h2>
          <p>
            {isLogin
              ? "Pick up where curiosity left off. Your next challenge is closer than you think."
              : "Start with a question. Find a challenge. Give your ideas room to become something real."}
          </p>
        </div>
        <div className="auth-story-art" aria-hidden="true">
          <span className="auth-art-ring auth-art-ring-one" />
          <span className="auth-art-ring auth-art-ring-two" />
          <span className="auth-art-core">{isLogin ? "KEEP\nGOING" : "START\nSOMETHING"}</span>
          <span className="auth-art-spark">✳</span>
          <span className="auth-art-index">CC / {isLogin ? "RETURN" : "BEGIN"}</span>
        </div>
        <span className="auth-story-foot">A SPACE FOR STUDENT IDEAS <span>© 2026</span></span>
      </section>

      <section className="auth-form-side">
        <ThemeToggle />
        <div className="auth-mobile-brand">
          <Link className="auth-logo" to="/" aria-label="CampusCode home">
            <img src={logo} alt="CampusCode Hackathon Arena" />
          </Link>
          <Link className="auth-mobile-back" to="/" aria-label="Back to home"><ArrowLeft size={18} /></Link>
        </div>
        <div className="auth-form-wrap">
          <div className="auth-heading">
            <span className="eyebrow"><span className="eyebrow-slash">//</span> {eyebrow}</span>
            <h1>{title}</h1>
            <p>{description}</p>
          </div>
          {children}
          <div className="auth-page-switch">
            {isLogin ? (
              <>New to CampusCode? <Link to="/register">Create an account <ArrowUpRight size={14} /></Link></>
            ) : (
              <>Already have a demo profile? <Link to="/login">Log in <ArrowUpRight size={14} /></Link></>
            )}
          </div>
          <p className="auth-disclosure">
            Demo experience only. No real account, authentication, email verification, or CAPTCHA security is provided.
          </p>
        </div>
      </section>
    </main>
  );
}
