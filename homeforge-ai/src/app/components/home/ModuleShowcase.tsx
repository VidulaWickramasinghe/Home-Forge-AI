import {
  Bot,
  Calculator,
  Hammer,
  Home,
  Layers,
  Palette,
  Ruler,
  TreePalm,
} from "lucide-react";

const modules = [
  {
    icon: TreePalm,
    title: "Property & Site",
    desc: "Create land boundaries, gardens, driveways, pools, slopes, fences, and outdoor lighting.",
  },
  {
    icon: Layers,
    title: "Floor Plan Designer",
    desc: "Draw walls, create rooms, set dimensions, add doors, windows, and multiple floors.",
  },
  {
    icon: Hammer,
    title: "Structure Builder",
    desc: "Configure foundations, columns, beams, structural walls, roof systems, and levels.",
  },
  {
    icon: Home,
    title: "Exterior Customizer",
    desc: "Customize roof styles, facades, cladding, gutters, solar panels, windows, and doors.",
  },
  {
    icon: Palette,
    title: "Interior Designer",
    desc: "Apply paint, wallpaper, flooring, ceilings, furniture, kitchen, and bathroom finishes.",
  },
  {
    icon: Bot,
    title: "AI Design Assistant",
    desc: "Generate layouts, suggest room placement, recommend materials, and detect design issues.",
  },
  {
    icon: Calculator,
    title: "Cost Estimation",
    desc: "Estimate construction, materials, labor, interiors, landscaping, pools, and upgrades.",
  },
  {
    icon: Ruler,
    title: "Measurements",
    desc: "Calculate room areas, wall lengths, roof area, floor area, and material quantities.",
  },
];

export default function ModuleShowcase() {
  return (
    <section id="modules" className="relative px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            Complete Platform
          </p>
          <h2 className="text-4xl font-black md:text-6xl">
            Every module needed to design, preview, and plan a house.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/65">
            Visitors can explore the product like a digital showroom, moving through
            modules that explain the full design-to-construction journey.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-3xl glass p-6 transition duration-300 hover:-translate-y-2 hover:border-cyan-300/50 hover:bg-white/[0.09]"
              >
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-300">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/60">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}