import { NavLink } from "react-router-dom";
import { NAV_SECTIONS } from "../data/navItems";
import "./Sidebar.css";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__head">
        <span className="sidebar__logo">E</span>
        <span className="sidebar__title">Ecommerce admin</span>
      </div>

      <nav className="sidebar__nav">
        {NAV_SECTIONS.map((section, i) => (
          <div className="sidebar__section" key={section.title ?? `section-${i}`}>
            {section.title && <p className="sidebar__section-title">{section.title}</p>}
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  "sidebar__link" + (isActive ? " sidebar__link--active" : "")
                }
              >
                <span className="sidebar__icon">{item.icon}</span>
                <span className="sidebar__label">{item.label}</span>
                {item.badge !== undefined && <span className="sidebar__badge">{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}