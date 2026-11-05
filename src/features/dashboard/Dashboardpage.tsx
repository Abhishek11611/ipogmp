import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { searchBrands } from "../brands/api/brandsApi";
import type { Brand } from "../brands/types/brand";
import "./Dashboardpage.css";

interface StatCardProps {
  label: string;
  value: ReactNode;
  hint: string;
  tone: "blue" | "violet" | "green" | "amber";
  icon: ReactNode;
}

function StatCard({ label, value, hint, tone, icon }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card__top">
        <span className="stat-card__label">{label}</span>
        <span className={`stat-card__icon stat-card__icon--${tone}`}>
          {icon}
        </span>
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__hint">{hint}</div>
    </article>
  );
}

export default function DashboardPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [totalBrands, setTotalBrands] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    searchBrands("", 0, 5)
      .then((res) => {
        if (!active) return;
        setBrands(res.data);
        setTotalBrands(res.totalRecords);
      })
      .catch(() => {
        if (!active) return;
        setTotalBrands(null);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Overview</h1>
          <p className="page__subtitle">
            A snapshot of your catalog and store activity.
          </p>
        </div>
        <Link to="/brands" className="btn btn--primary">
          Manage brands
        </Link>
      </div>

      <section className="stats-grid">
        <StatCard
          label="Total brands"
          value={totalBrands ?? "—"}
          hint="Across your catalog"
          tone="blue"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.6 13.4 12 22l-8-8V4h10l6.6 6.6a2 2 0 0 1 0 2.8Z" />
              <circle cx="7.5" cy="7.5" r="1.2" />
            </svg>
          }
        />
        <StatCard
          label="Products"
          value="—"
          hint="Product service not connected"
          tone="violet"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m21 8-9-5-9 5 9 5 9-5Z" />
              <path d="M3 8v8l9 5 9-5V8" />
              <path d="M12 13v8" />
            </svg>
          }
        />
        <StatCard
          label="Orders"
          value="—"
          hint="Order service not connected"
          tone="green"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="20" r="1.4" />
              <circle cx="18" cy="20" r="1.4" />
              <path d="M2 3h3l2.4 11.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6" />
            </svg>
          }
        />
        <StatCard
          label="Active users"
          value="—"
          hint="User service feed pending"
          tone="amber"
          icon={
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
              <path d="M16 3.1a4 4 0 0 1 0 7.8" />
            </svg>
          }
        />
      </section>

      <div className="dashboard-grid">
        <section className="card">
          <header className="card__head">
            <div>
              <h2 className="card__title">Recent brands</h2>
              <p className="card__subtitle">Newest entries in your catalog</p>
            </div>
            <Link to="/brands" className="card__link">
              View all
            </Link>
          </header>

          <div className="card__body card__body--flush">
            {brands.length === 0 ? (
              <p className="card__empty">
                No brands yet. Create your first brand to get started.
              </p>
            ) : (
              <ul className="recent-list">
                {brands.map((brand) => {
                  const inactive =
                    brand.status?.toLowerCase() === "inactive";
                  return (
                    <li className="recent-item" key={brand.brandCode}>
                      <span className="recent-item__avatar" aria-hidden="true">
                        {brand.name.charAt(0).toUpperCase()}
                      </span>
                      <div className="recent-item__meta">
                        <span className="recent-item__name">{brand.name}</span>
                        <span className="recent-item__slug">
                          {brand.brandCode}
                        </span>
                      </div>
                      <span
                        className={
                          "status-badge " +
                          (inactive
                            ? "status-badge--inactive"
                            : "status-badge--active")
                        }
                      >
                        <span className="status-badge__dot" />
                        {brand.status ?? "Active"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>

        <section className="card">
          <header className="card__head">
            <div>
              <h2 className="card__title">Workspace setup</h2>
              <p className="card__subtitle">Finish configuring your store</p>
            </div>
          </header>

          <div className="card__body checklist">
            <div className="checklist__item checklist__item--done">
              <span className="checklist__dot" aria-hidden="true" />
              <span className="checklist__label">Authentication</span>
              <span className="checklist__tag">Done</span>
            </div>
            <div className="checklist__item checklist__item--done">
              <span className="checklist__dot" aria-hidden="true" />
              <span className="checklist__label">Brand catalog</span>
              <span className="checklist__tag">Done</span>
            </div>
            <div className="checklist__item">
              <span className="checklist__dot" aria-hidden="true" />
              <span className="checklist__label">Product catalog</span>
              <span className="checklist__tag checklist__tag--next">Next</span>
            </div>
            <div className="checklist__item">
              <span className="checklist__dot" aria-hidden="true" />
              <span className="checklist__label">Notifications</span>
              <span className="checklist__tag">Pending</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
