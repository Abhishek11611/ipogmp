import { useEffect, useState } from "react";
import BrandTable from "../components/BrandTable";
import { searchBrands, createBrand, updateBrand } from "../api/brandsApi";
import type { Brand } from "../types/brand";
import "../styles/Brands.css";
import BrandFormModal from "./Brandformmodal";

const PAGE_SIZE = 10;

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [modalBrand, setModalBrand] = useState<Brand | "new" | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    searchBrands(search, page, PAGE_SIZE)
      .then((res) => {
        setBrands(res.data);
        setTotalPages(res.totalPages);
        setTotalRecords(res.totalRecords);
      })
      .catch(() => setError("Couldn't load brands."))
      .finally(() => setLoading(false));
  };

  // Re-fetch whenever the page changes, and debounce the search box so we
  // don't fire a request on every keystroke.
  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search]);

  const handleCreate = async (values: {
    name: string;
    slug: string;
    description: string;
  }) => {
    await createBrand(values);
    setModalBrand(null);
    load();
  };

  const handleUpdate = async (
    brandCode: string,
    values: { name: string; slug: string; description: string }
  ) => {
    await updateBrand({ brandCode, ...values });
    setModalBrand(null);
    load();
  };

  return (
    <div className="page">
      <div className="page__head">
        <div>
          <h1 className="page__title">Brands</h1>
          <p className="page__subtitle">
            Master brand directory owned by the Catalog service.
          </p>
        </div>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setModalBrand("new")}
        >
          + Add brand
        </button>
      </div>

      <div className="toolbar">
        <div className="toolbar__search">
          <input
            className="search-input"
            type="search"
            placeholder="Search brands…"
            value={search}
            onChange={(e) => {
              setPage(0);
              setSearch(e.target.value);
            }}
          />
        </div>
        <span className="toolbar__meta">
          {totalRecords} brand{totalRecords === 1 ? "" : "s"}
        </span>
      </div>

      {loading && <p className="page__state">Loading brands…</p>}
      {error && <p className="banner banner--error">{error}</p>}

      {!loading && !error && (
        <>
          <BrandTable
            brands={brands}
            onEdit={(brand) => setModalBrand(brand)}
          />

          <div className="pagination">
            <button
              type="button"
              className="pagination__button"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>

            <div className="pagination__pages">
              <span className="pagination__current">{page + 1}</span>
              <span className="pagination__of">of {totalPages}</span>
            </div>

            <button
              type="button"
              className="pagination__button"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}

      {modalBrand === "new" && (
        <BrandFormModal
          onCancel={() => setModalBrand(null)}
          onSubmit={handleCreate}
        />
      )}

      {modalBrand && modalBrand !== "new" && (
        <BrandFormModal
          brand={modalBrand}
          onCancel={() => setModalBrand(null)}
          onSubmit={(values) => handleUpdate(modalBrand.brandCode, values)}
        />
      )}
    </div>
  );
}
