import { Nav } from "hatchet-web";

const navItems = [
  {
    label: "Solutions",
    children: [
      { label: "Discovery", href: "/solutions/discovery" },
      { label: "Intelligence", href: "/solutions/intelligence" },
      { label: "Creator Community", href: "/solutions/creator-community" },
      { label: "Reporting", href: "/solutions/reporting" },
    ],
  },
  {
    label: "Who We Serve",
    children: [
      { label: "Brands", href: "/who-we-serve/brands" },
      { label: "Game Publishers", href: "/who-we-serve/games-publishers" },
      { label: "Agencies", href: "/who-we-serve/agencies" },
    ],
  },
  { label: "Resources", href: "/resources" },
  { label: "Pricing", href: "/pricing" },
];

export function Default() {
  return (
    <div className="bg-card px-6 py-3 rounded-xl flex items-center">
      <Nav items={navItems} className="flex" />
    </div>
  );
}
