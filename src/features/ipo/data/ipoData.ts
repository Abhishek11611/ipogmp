export interface IPO {
  name: string;
  gmp: string;
  rating: string;
  sub: string;
  price: number;
  ipoSize: number;
  lot: number;
  open: string;
  close: string;
  boa: string;
  listing: string;
  updated: string;
}

export const ipoData: IPO[] = [
  {
    name: "Biopol Chemicals NSE SME",
    gmp: "₹-- (0.00%)",
    rating: "🔥",
    sub: "0x / 0x / 0x",
    price: 10008,
    ipoSize: 29.63,
    lot: 1200,
    open: "6-Feb",
    close: "10-Feb",
    boa: "11-Feb",
    listing: "13-Feb",
    updated: "29-Jan 15:35",
  },
  {
    name: "NFP Sampoorna Foods NSE SME",
    gmp: "₹-- (0.00%)",
    rating: "🔥",
    sub: "0x / 0x / 0x",
    price: 55,
    ipoSize: 23.3,
    lot: 2000,
    open: "4-Feb",
    close: "6-Feb",
    boa: "9-Feb",
    listing: "11-Feb",
    updated: "29-Jan 15:30",
  },
];