import { NavLink } from "react-router-dom";
import { NAV_SECTIONS } from "../data/navItems";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__head">
        <span className="sidebar__logo">S</span>
        <div className="sidebar__brand">
          <span className="sidebar__title">Store Admin</span>
          <span className="sidebar__subtitle">Commerce workspace</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {NAV_SECTIONS.map((section, i) => (
          <div className="sidebar__section" key={section.title ?? `section-${i}`}>
            {section.title && (
              <p className="sidebar__section-title">{section.title}</p>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  "sidebar__link" + (isActive ? " sidebar__link--active" : "")
                }
              >
                <span className="sidebar__icon" aria-hidden="true">
                  {item.icon}
                </span>
                <span className="sidebar__label">{item.label}</span>
                {item.badge !== undefined && (
                  <span className="sidebar__badge">{item.badge}</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar__foot">
        <span className="sidebar__foot-dot" aria-hidden="true" />
        <div className="sidebar__foot-meta">
          <span className="sidebar__foot-title">Development</span>
          <span className="sidebar__foot-sub">Gateway :8090</span>
        </div>
      </div>
    </aside>
  );
}
