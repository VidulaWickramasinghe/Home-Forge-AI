const modules = [
  {
    icon: "🌍",
    title: "Property & Site",
    text: "Define land size, terrain, slopes, driveways, gardens, pools, fences, parking areas, and outdoor lighting."
  },
  {
    icon: "📐",
    title: "Floor Plan Designer",
    text: "Draw walls, create rooms, split spaces, add doors and windows, label rooms, and set dimensions."
  },
  {
    icon: "🏗️",
    title: "Structural Module",
    text: "Visualize foundations, columns, beams, structural walls, roof systems, slabs, and stair locations."
  },
  {
    icon: "🏠",
    title: "Exterior Design",
    text: "Customize facades, cladding, roof styles, gutters, solar panels, exterior doors, and windows."
  },
  {
    icon: "🛋️",
    title: "Interior Design",
    text: "Apply wall paint, flooring, ceilings, furniture, lighting, wallpaper, panels, and decorative finishes."
  },
  {
    icon: "🍳",
    title: "Kitchen Designer",
    text: "Configure cabinets, benchtops, islands, appliances, sinks, splashbacks, pantries, and layouts."
  },
  {
    icon: "🚿",
    title: "Bathroom Designer",
    text: "Place showers, bathtubs, vanities, toilets, mirrors, tapware, tiles, lighting, and bathroom storage."
  },
  {
    icon: "🤖",
    title: "AI Assistant",
    text: "Generate concepts, suggest layouts, optimize room placement, recommend materials, and detect issues."
  },
  {
    icon: "💰",
    title: "Cost Estimator",
    text: "Estimate construction, foundation, walls, roofing, interiors, landscaping, pools, and material costs."
  },
  {
    icon: "📏",
    title: "Measurements",
    text: "Calculate total floor area, room areas, wall lengths, roof area, window area, and material quantities."
  },
  {
    icon: "🎥",
    title: "Rendering",
    text: "Generate photorealistic images, 360 panoramas, virtual tours, videos, and presentation visuals."
  },
  {
    icon: "📦",
    title: "Export System",
    text: "Export design files as GLB, OBJ, FBX, STL, IFC, DWG, PDF, PNG, and editable JSON."
  }
];

const workflow = [
  "Create Plot",
  "Draw Floor Plan",
  "Generate 3D Model",
  "Customize Structure",
  "Design Exterior",
  "Design Interior",
  "Apply Materials",
  "Walk Through",
  "Review Cost",
  "Export Design"
];

const features = [
  "Real-time 3D preview",
  "Virtual walkthrough",
  "Day and night simulation",
  "Material library",
  "AI-generated layouts",
  "Area calculation",
  "Cost breakdown",
  "Design version saving",
  "Builder-ready export",
  "Future VR and AR support"
];

const costItems = [
  { name: "Foundation", price: "$38,000" },
  { name: "Walls & Structure", price: "$82,500" },
  { name: "Roofing", price: "$41,200" },
  { name: "Windows & Doors", price: "$29,800" },
  { name: "Interior Finishes", price: "$74,400" },
  { name: "Kitchen & Bathrooms", price: "$96,000" },
  { name: "Landscaping", price: "$31,500" },
  { name: "Estimated Total", price: "$393,400" }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020617] text-white">
      <section className="relative min-h-screen px-6 py-6">
        <div className="absolute inset-0 hero-grid" />
        <div className="absolute left-[-12rem] top-[-12rem] h-[32rem] w-[32rem] rounded-full bg-cyan-400/20 blur-[120px]" />
        <div className="absolute right-[-12rem] top-[8rem] h-[32rem] w-[32rem] rounded-full bg-amber-300/10 blur-[120px]" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-3xl border border-white/10 bg-white/[0.06] px-5 py-4 backdrop-blur-xl">
          <a href="#" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-300/30">
              🏠
            </span>
            <div>
              <p className="text-lg font-black tracking-wide">HomeForge AI</p>
              <p className="text-xs text-white/50">Build before you build</p>
            </div>
          </a>

          <div className="hidden items-center gap-7 text-sm text-white/70 md:flex">
            <a href="#modules" className="transition hover:text-cyan-300">
              Modules
            </a>
            <a href="#experience" className="transition hover:text-cyan-300">
              Experience
            </a>
            <a href="#workflow" className="transition hover:text-cyan-300">
              Workflow
            </a>
            <a href="#ai" className="transition hover:text-cyan-300">
              AI
            </a>
          </div>

          <a
            href="#start"
            className="rounded-full bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:scale-105 hover:bg-cyan-100"
          >
            Explore
          </a>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 pt-20 lg:grid-cols-2 lg:pt-28">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-medium text-cyan-200">
              <span>✨</span>
              3D Digital House Configurator
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[1.02] tracking-tight md:text-7xl">
              Design, explore, and price your future home in{" "}
              <span className="text-gradient">real-time 3D.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/68">
              HomeForge AI lets future homeowners create plots, draw floor
              plans, customize interiors and exteriors, walk through the house,
              calculate measurements, estimate costs, and export final designs
              before construction begins.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#experience"
                className="rounded-full bg-cyan-300 px-8 py-4 text-center font-black text-slate-950 shadow-xl shadow-cyan-300/20 transition hover:scale-105 hover:bg-cyan-200"
              >
                Launch Experience
              </a>
              <a
                href="#modules"
                className="rounded-full border border-white/15 bg-white/[0.04] px-8 py-4 text-center font-bold text-white/85 backdrop-blur transition hover:bg-white/10"
              >
                View Modules
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-2xl font-black text-cyan-200">600 m²</p>
                <p className="mt-1 text-xs text-white/50">Land example</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-2xl font-black text-cyan-200">4 Bed</p>
                <p className="mt-1 text-xs text-white/50">AI layout</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-4">
                <p className="text-2xl font-black text-cyan-200">$393k</p>
                <p className="mt-1 text-xs text-white/50">Estimate</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[3rem] bg-cyan-300/20 blur-[80px]" />
            <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-2xl shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="font-black">Live 3D Preview</p>
                  <p className="text-sm text-white/50">Interactive concept model</p>
                </div>
                <div className="rounded-full bg-emerald-400/15 px-4 py-2 text-xs font-bold text-emerald-200">
                  ONLINE
                </div>
              </div>

              <div className="house-stage">
                <div className="house-world">
                  <div className="ground" />
                  <div className="house-body">
                    <div className="house-face front">
                      <div className="window wide" />
                      <div className="door" />
                      <div className="window small" />
                    </div>
                    <div className="house-face back" />
                    <div className="house-face left" />
                    <div className="house-face right">
                      <div className="window side-window" />
                    </div>
                    <div className="house-face roof-one" />
                    <div className="house-face roof-two" />
                  </div>
                  <div className="pool" />
                  <div className="tree tree-one" />
                  <div className="tree tree-two" />
                </div>
              </div>

              <div className="grid gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-sm text-white/50">View</p>
                  <p className="font-bold">Orbit + Walk</p>
                </div>
                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-sm text-white/50">Mode</p>
                  <p className="font-bold">Day / Night</p>
                </div>
                <div className="rounded-2xl bg-black/20 p-4">
                  <p className="text-sm text-white/50">Export</p>
                  <p className="font-bold">GLB / PDF</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modules" className="relative px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="section-label">Complete Platform</p>
            <h2 className="section-title">
              Every house design module in one powerful digital studio.
            </h2>
            <p className="section-text">
              From land definition to floor planning, interior styling, cost
              estimation, AI recommendations, and export, the platform covers
              the full pre-construction design journey.
            </p>
          </div>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <article key={module.title} className="feature-card">
                <div className="mb-5 text-4xl">{module.icon}</div>
                <h3 className="text-xl font-black">{module.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">
                  {module.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="px-6 py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="section-label mb-2">Builder Preview</p>
                <h2 className="text-3xl font-black md:text-5xl">
                  A full web app interface for real design exploration.
                </h2>
              </div>
            </div>

            <div className="builder-shell">
              <aside className="builder-panel">
                <p className="mb-4 text-sm font-black text-cyan-200">Tools</p>
                {["Select", "Wall", "Door", "Window", "Room", "Material"].map(
                  (tool) => (
                    <div key={tool} className="tool-row">
                      {tool}
                    </div>
                  )
                )}
              </aside>

              <div className="plan-area">
                <div className="room room-living">Living</div>
                <div className="room room-kitchen">Kitchen</div>
                <div className="room room-bedroom">Bedroom</div>
                <div className="room room-bath">Bath</div>
              </div>

              <aside className="builder-panel">
                <p className="mb-4 text-sm font-black text-amber-200">
                  Metrics
                </p>
                <div className="metric-row">
                  <span>Total Area</span>
                  <strong>214 m²</strong>
                </div>
                <div className="metric-row">
                  <span>Rooms</span>
                  <strong>8</strong>
                </div>
                <div className="metric-row">
                  <span>Walls</span>
                  <strong>42 m</strong>
                </div>
                <div className="metric-row">
                  <span>Cost</span>
                  <strong>$393k</strong>
                </div>
              </aside>
            </div>
          </div>

          <div className="space-y-5">
            {features.map((feature) => (
              <div
                key={feature}
                className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl transition hover:-translate-y-1 hover:border-cyan-300/40"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-200">
                    ✓
                  </span>
                  <p className="font-bold">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="px-6 py-28">
        <div className="mx-auto max-w-7xl rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl md:p-12">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="section-label text-amber-200">User Workflow</p>
              <h2 className="section-title">
                From empty land to a complete digital house.
              </h2>
              <p className="section-text">
                The workflow guides visitors through a clear design journey:
                define the land, draw the plan, customize the design, walk
                through the 3D house, review cost, and export.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workflow.map((step, index) => (
                <div key={step} className="workflow-card">
                  <p className="text-sm font-bold text-cyan-200">
                    Step {index + 1}
                  </p>
                  <h3 className="mt-2 font-black">{step}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="ai" className="px-6 py-28">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div className="rounded-[2.5rem] border border-cyan-300/20 bg-cyan-300/[0.07] p-8 backdrop-blur-xl md:p-12">
            <p className="section-label">AI Design Assistant</p>
            <h2 className="section-title">
              Type your dream home. Let AI generate the first concept.
            </h2>
            <p className="section-text">
              The AI assistant can suggest layouts, room placement, material
              palettes, cost-saving ideas, design alternatives, and issue
              warnings.
            </p>

            <div className="mt-8 rounded-3xl border border-white/10 bg-black/25 p-5">
              <p className="mb-3 text-sm font-bold text-cyan-200">Prompt</p>
              <p className="leading-7 text-white/75">
                Create a modern 600 m² family house with 4 bedrooms, 3
                bathrooms, double garage, open kitchen, pool, solar roof, and
                outdoor entertainment area.
              </p>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.06] p-8 backdrop-blur-xl md:p-12">
            <p className="mb-6 text-sm font-black uppercase tracking-[0.3em] text-emerald-200">
              AI Output Preview
            </p>

            <div className="space-y-4">
              {[
                "Open-plan kitchen facing garden view",
                "Master bedroom placed away from noisy street side",
                "North-facing windows recommended for natural light",
                "Estimated construction range generated",
                "3D concept ready for preview"
              ].map((item) => (
                <div key={item} className="ai-output">
                  <span>✅</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl">
            <p className="section-label">Cost Intelligence</p>
            <h2 className="section-title">
              Real-time cost and material estimate preview.
            </h2>
            <p className="section-text">
              Every design change can update the estimated cost by category,
              helping users compare options before construction decisions.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {costItems.map((item) => (
              <div
                key={item.name}
                className={`rounded-3xl border p-6 backdrop-blur-xl ${
                  item.name === "Estimated Total"
                    ? "border-cyan-300/40 bg-cyan-300/10"
                    : "border-white/10 bg-white/[0.05]"
                }`}
              >
                <p className="text-sm text-white/55">{item.name}</p>
                <p className="mt-3 text-2xl font-black">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="start" className="px-6 py-28">
        <div className="mx-auto max-w-5xl rounded-[3rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/20 via-white/[0.07] to-amber-300/10 p-10 text-center shadow-2xl shadow-cyan-950/40 md:p-16">
          <p className="section-label">Build Before You Build</p>
          <h2 className="text-4xl font-black leading-tight md:text-6xl">
            Turn home construction into an interactive digital experience.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
            HomeForge AI helps users design, explore, estimate, and export a
            future home before the first brick is placed.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#modules"
              className="rounded-full bg-white px-8 py-4 font-black text-slate-950 transition hover:scale-105 hover:bg-cyan-100"
            >
              Explore Website
            </a>
            <a
              href="#experience"
              className="rounded-full border border-white/15 px-8 py-4 font-black text-white transition hover:bg-white/10"
            >
              View Builder Preview
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/50 md:flex-row md:items-center md:justify-between">
          <p>© 2026 HomeForge AI. Concept design and visualization platform.</p>
          <p>
            Concept only. Final construction must be reviewed by qualified
            professionals.
          </p>
        </div>
      </footer>
    </main>
  );
}