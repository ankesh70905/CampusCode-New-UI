import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";

export default function EventCard({ event, index, onExplore }) {
  return (
    <article className={`event-card event-card-${event.color} reveal`} style={{ "--delay": `${index * 100}ms` }}>
      <div className="event-card-top">
        <span className="event-category">{event.category}</span>
        <span className="event-mark" aria-hidden="true">{event.mark}</span>
      </div>
      <div className="event-art" aria-hidden="true">
        <span className="event-art-orbit" />
        <span className="event-art-core">{event.mark}</span>
        <span className="event-art-cross">✳</span>
      </div>
      <div className="event-card-copy">
        <div className="event-status"><span />{event.registration}</div>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="event-meta">
          <span><CalendarDays size={14} />{event.date}</span>
          <span><MapPin size={14} />{event.format}</span>
        </div>
        <button className="event-explore" type="button" onClick={() => onExplore(event)}>
          Explore event <ArrowUpRight size={17} />
        </button>
      </div>
    </article>
  );
}
