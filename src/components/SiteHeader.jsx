import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/brand.js";
import ThemeToggle from "./ThemeToggle.jsx";

const links = [
  { label: "Home", href: "#top" },
  { label: "Discover", href: "#events" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Community", href: "#community" },
  { label: "About", href: "#about" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("#top");

  useEffect(() => {
    const targets = links
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveHash(`#${visible.target.id}`);
      },
      { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.1, 0.35] },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="header-inner">
        <a className="brand-link" href="#top" onClick={closeMenu} aria-label="CampusCode home">
          <img src={logo} alt="CampusCode Hackathon Arena" />
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav
          id="primary-navigation"
          className={`primary-navigation${menuOpen ? " is-open" : ""}`}
          aria-label="Main navigation"
        >
          <div className="nav-links">
            {links.map(({ label, href }) => (
              <a
                key={href}
                className={`nav-link${activeHash === href ? " is-active" : ""}`}
                href={href}
                aria-current={activeHash === href ? "location" : undefined}
                onClick={closeMenu}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            <Link className="nav-login" to="/login" onClick={closeMenu}>
              Log in
            </Link>
            <Link className="button button-dark button-nav" to="/register" onClick={closeMenu}>
              Join CampusCode <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
