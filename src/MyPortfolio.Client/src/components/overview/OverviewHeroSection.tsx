export default function OverviewHeroSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
      <div className="space-y-4 p-6 border rounded-md bg-white/80 shadow-sm dark:bg-[#1f2937]/90">
        <p className="text-xs uppercase tracking-[0.3em] text-primary">
          Full Stack Developer
        </p>

        <div className="space-y-2">
            <h1 className="text-2xl font-semibold">
                Building scalable web applications with ASP.NET Core & React
            </h1>

            <p className="text-sm text-muted-foreground">
                Full-stack developer focused on building clean, scalable, and maintainable
                web applications using ASP.NET Core, C#, React, and SQL Server. This portfolio
                is inspired by GitHub’s interface design to showcase projects in a clean and
                developer-friendly way.
            </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Backend
            </p>
            <p className="mt-2 text-lg font-semibold">ASP.NET Core</p>
          </div>

          <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Frontend
            </p>
            <p className="mt-2 text-lg font-semibold">React + TS</p>
          </div>

          <div className="rounded-lg border p-4 bg-slate-50 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Database
            </p>
            <p className="mt-2 text-lg font-semibold">SQL Server</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6 border rounded-md bg-white/80 shadow-sm dark:bg-[#1f2937]/90">
        <h2 className="text-base font-semibold">What I focus on</h2>

        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Building scalable REST APIs with ASP.NET Core</li>
          <li>• Creating responsive UI with React + Tailwind</li>
          <li>• Clean architecture & maintainable code design</li>
          <li>• Portfolio & real-world system projects</li>
        </ul>

        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Updated April 2026
        </p>
      </div>
    </section>
  );
}