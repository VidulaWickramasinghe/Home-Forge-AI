const steps = [
  "Create plot",
  "Design floor plan",
  "Generate 3D model",
  "Customize exterior",
  "Design interior",
  "Apply materials",
  "Walk through house",
  "Review cost",
  "Export design",
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className="px-6 py-28">
      <div className="mx-auto max-w-7xl rounded-[2rem] glass p-8 md:p-12">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-yellow-200">
              User Journey
            </p>
            <h2 className="text-4xl font-black md:text-5xl">
              From empty land to a full digital home.
            </h2>
            <p className="mt-5 text-lg leading-8 text-white/65">
              The website should guide visitors through a clear visual workflow,
              showing how a homeowner can design, customize, estimate, and export
              the house before construction begins.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-sm text-cyan-300">Step {index + 1}</p>
                <h3 className="mt-2 font-bold">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}