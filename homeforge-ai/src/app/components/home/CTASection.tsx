export default function CTASection() {
  return (
    <section id="start" className="px-6 py-28">
      <div className="mx-auto max-w-5xl rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-cyan-300/20 via-white/[0.06] to-yellow-200/10 p-10 text-center shadow-2xl md:p-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200">
          Build Before You Build
        </p>

        <h2 className="text-4xl font-black md:text-6xl">
          Turn home construction into an interactive digital experience.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/70">
          Homeowners can design, explore, estimate, and export their dream house
          before the first brick is placed.
        </p>

        <div className="mt-10">
          <a
            href="#modules"
            className="inline-flex rounded-full bg-white px-8 py-4 font-bold text-slate-950 transition hover:scale-105 hover:bg-cyan-100"
          >
            Start Exploring
          </a>
        </div>
      </div>
    </section>
  );
}