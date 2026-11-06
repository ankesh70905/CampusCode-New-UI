import { useEffect, useRef } from "react";
import { ArrowUpRight, CalendarDays, MapPin, X } from "lucide-react";

export default function EventDialog({ event, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!event) return undefined;
    const previousFocus = document.activeElement;
    const closeButton = dialogRef.current?.querySelector(".dialog-close");
    closeButton?.focus();
    const onKeyDown = (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        onClose();
        return;
      }
      if (keyboardEvent.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])");
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (keyboardEvent.shiftKey && document.activeElement === first) {
        keyboardEvent.preventDefault();
        last.focus();
      } else if (!keyboardEvent.shiftKey && document.activeElement === last) {
        keyboardEvent.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section ref={dialogRef} className="event-dialog" role="dialog" aria-modal="true" aria-labelledby="dialog-title" aria-describedby="event-description">
        <button className="dialog-close" type="button" onClick={onClose} aria-label="Close event details">
          <X size={20} />
        </button>
        <span className="eyebrow">{event.category} / SAMPLE LISTING</span>
        <h2 id="dialog-title">{event.title}</h2>
        <p id="event-description">{event.description}</p>
        <div className="dialog-detail">
          <span><CalendarDays size={16} />{event.date}</span>
          <span><MapPin size={16} />{event.format}</span>
        </div>
        <p className="demo-notice">
          This is illustrative demo content, not a live event listing. Registration is not available in this landing-page phase.
        </p>
        <button className="button button-purple" type="button" onClick={onClose}>
          Back to opportunities <ArrowUpRight size={16} />
        </button>
      </section>
    </div>
  );
}
