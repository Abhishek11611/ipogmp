import type { IPO } from "./ipoData";
export type Column<T> = {
  header: string;
  accessor: keyof T;
  className?: string;
};
export const ipoColumns: Column<IPO>[] = [
  { header: "Name", accessor: "name", className: "name" },
  { header: "GMP", accessor: "gmp" },
  { header: "Rating", accessor: "rating" },
  { header: "Sub", accessor: "sub" },
  { header: "Price (₹)", accessor: "price" },
  { header: "IPO Size (₹ Cr)", accessor: "ipoSize" },
  { header: "Lot", accessor: "lot" },
  { header: "Open", accessor: "open" },
  { header: "Close", accessor: "close" },
  { header: "BoA Dt", accessor: "boa" },
  { header: "Listing", accessor: "listing" },
  { header: "Updated", accessor: "updated", className: "updated" },
];