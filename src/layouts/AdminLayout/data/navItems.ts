export interface NavItem {
  to: string;
  label: string;
  icon: string;
  badge?: number;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [{ to: "/dashboard", label: "Dashboard", icon: "▤" }],
  },
  {
    title: "Catalog",
    items: [
      { to: "/brands", label: "Brands", icon: "◉" },
    ],
  },
];