import { Bot, Sparkles } from "lucide-react";
 

export default function AISection() {
  return (
    <section id="ai" className="px-6 py-28">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
        <div className="rounded-[2rem] glass p-8 md:p-10">
          <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-cyan-300/10 text-cyan-300">
            <Bot size={28} />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">
            AI Design Assistant
          </p>

          <h2 className="text-4xl font-black md:text-5xl">
            Enter your dream. Let AI generate the first concept.
          </h2>

          <p className="mt-5 text-lg leading-8 text-white/65">
            The assistant can generate layout suggestions, material palettes,
            cost ranges, room placement ideas, and design warnings.
          </p>
        </div>

        <div className="rounded-[2rem] border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
          <div className="rounded-3xl bg-black/40 p-5">
            <div className="mb-4 flex items-center gap-2 text-cyan-200">
              <Sparkles size={18} />
              AI Prompt
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-white/75">
              Create a modern 600 m² family house with 4 bedrooms, 3 bathrooms,
              double garage, open kitchen, pool, and outdoor entertainment area.
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-2xl bg-white/[0.05] p-4">
                ✅ Suggested open-plan kitchen facing garden
              </div>

              <div className="rounded-2xl bg-white/[0.05] p-4">
                ✅ Master bedroom placed away from noisy street side
              </div>

              <div className="rounded-2xl bg-white/[0.05] p-4">
                ✅ Estimated construction range generated
              </div>

              <div className="rounded-2xl bg-white/[0.05] p-4">
                ✅ 3D concept ready for preview
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}