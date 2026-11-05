import type { Brand } from "../types/brand";

interface BrandTableProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
}

export default function BrandTable({
  brands,
  onEdit,
}: BrandTableProps) {
  if (brands.length === 0) {
    return <p className="page__state">No brands found.</p>;
  }

  return (
    <div className="data-table">
      <table>
        <thead>
          <tr>
            <th>BRAND</th>
            <th>CODE</th>
            <th>SLUG</th>
            <th>ASSIGNED PRODUCTS</th>
            <th>STATUS</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {brands.map((brand) => (
            <tr key={brand.brandCode}>

              <td className="data-table__strong">
                {brand.name}
              </td>

              <td className="data-table__mono">
                {brand.brandCode}
              </td>

              <td className="data-table__mono data-table__muted">
                {brand.slug}
              </td>

              <td>
                <span className="assigned-products">
                  {brand.assignedProducts ?? 0} products
                </span>
              </td>

              <td>
                <span
                  className={`status-badge ${
                    brand.status?.toLowerCase() === "inactive"
                      ? "status-badge--inactive"
                      : "status-badge--active"
                  }`}
                >
                  <span className="status-badge__dot" />
                  {brand.status ?? "Active"}
                </span>
              </td>

              <td>
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => onEdit(brand)}
                >
                  Edit
                </button>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}