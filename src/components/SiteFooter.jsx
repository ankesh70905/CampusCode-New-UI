import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/brand.js";

const footerLinks = [
  { label: "Discover", href: "#events" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Community", href: "#community" },
  { label: "About", href: "#about" },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <a href="#top" aria-label="CampusCode, back to top">
            <img src={logo} alt="CampusCode Hackathon Arena" />
          </a>
          <p>A starting point for students ready to turn curiosity into something real.</p>
        </div>
        <div className="footer-column">
          <span className="footer-label">EXPLORE</span>
          {footerLinks.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </div>
        <div className="footer-column">
          <span className="footer-label">YOUR SPACE</span>
          <Link to="/login">Log in <ArrowUpRight size={13} /></Link>
          <Link to="/register">Join CampusCode <ArrowUpRight size={13} /></Link>
          <span className="footer-coming">Frontend demo · local data only.</span>
        </div>
        <a className="back-top" href="#top" aria-label="Back to top">↑</a>
      </div>
      <div className="footer-bottom">
        <span>© 2026 CampusCode</span>
        <span>Student innovation starts with a first step.</span>
        <span className="footer-demo">DEMO CONCEPT</span>
      </div>
    </footer>
  );
}
