import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Brand } from "../types/brand";
import "../styles/Brands.css";

interface BrandFormValues {
  name: string;
  slug: string;
  description: string;
}

interface BrandFormModalProps {
  /** Pass an existing brand to edit it, or omit to create a new one. */
  brand?: Brand;
  onCancel: () => void;
  onSubmit: (values: BrandFormValues) => Promise<void>;
}

export default function BrandFormModal({
  brand,
  onCancel,
  onSubmit,
}: BrandFormModalProps) {
  const isEdit = Boolean(brand);
  const [values, setValues] = useState<BrandFormValues>({
    name: brand?.name ?? "",
    slug: brand?.slug ?? "",
    description: brand?.description ?? "",
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleChange =
    (field: keyof BrandFormValues) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!values.name.trim() || !values.slug.trim()) {
      setError("Name and slug are required.");
      return;
    }

    setError(null);
    setSaving(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="modal__head">
          <h2 className="modal__title">
            {isEdit ? "Edit brand" : "Add brand"}
          </h2>
          <button
            type="button"
            className="modal__close"
            onClick={onCancel}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>
          {isEdit && (
            <div className="field">
              <label htmlFor="brandCode">Brand code</label>
              <input id="brandCode" value={brand!.brandCode} disabled />
            </div>
          )}

          <div className="field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={values.name}
              onChange={handleChange("name")}
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="slug">Slug</label>
            <input
              id="slug"
              value={values.slug}
              onChange={handleChange("slug")}
            />
          </div>

          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={values.description}
              onChange={handleChange("description")}
            />
          </div>

          {error && <p className="field__error">{error}</p>}

          <div className="modal__actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? "Saving…" : isEdit ? "Save changes" : "Create brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
