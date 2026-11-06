import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/brand.js";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function NextPhasePage({ page }) {
  const location = useLocation();
  const notFound = page === "Page not found";
  const completedRegistration = location.state?.demoRegistration;
  const completedLogin = location.state?.demoLogin;
  return (
    <main className="next-phase-page">
      <div className="next-phase-card">
        <ThemeToggle />
        <Link to="/" className="next-phase-logo" aria-label="CampusCode home">
          <img src={logo} alt="CampusCode Hackathon Arena" />
        </Link>
        <span className="eyebrow"><span className="eyebrow-slash">//</span> {notFound ? "WRONG TURN" : completedRegistration || completedLogin ? "DEMO COMPLETE" : "IN THE WORKS"}</span>
        <h1>{notFound ? "This page isn't here." : completedRegistration ? "Your demo profile is ready." : completedLogin ? "Demo sign-in complete." : `${page} is part of the next phase.`}</h1>
        <p>{notFound
          ? "That route does not exist in this prototype yet."
          : completedRegistration
            ? "A non-sensitive demo profile was saved on this device. No account was authenticated."
            : completedLogin
                ? "The form was accepted for demonstration only. No identity was authenticated."
                : "This prototype does not implement that screen yet."}</p>
        <div className="next-phase-actions">
          <Link className="button button-purple" to="/">
            <ArrowLeft size={16} /> Back to CampusCode
          </Link>
          {completedRegistration && <Link className="next-phase-link" to="/login">Go to demo login <ArrowUpRight size={14} /></Link>}
        </div>
        {!completedRegistration && <span className="next-phase-note"><ArrowUpRight size={14} /> Frontend prototype · local only</span>}
      </div>
    </main>
  );
}
