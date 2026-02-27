import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5f9ff] text-slate-900">
      <div className="pointer-events-none absolute -left-28 -top-24 h-72 w-72 rounded-full bg-[#7dd3fc]/50 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-[#fde68a]/60 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[#86efac]/50 blur-3xl" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-between px-6 py-10 sm:px-10">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">GRID</h1>
          <Link
            to="/login"
            className="rounded-full border border-slate-300 bg-white/90 px-5 py-2 text-sm font-semibold text-slate-800 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Sign Up
          </Link>
        </header>

        <div className="grid items-center gap-10 py-10 md:grid-cols-2 md:py-16">
          <div className="space-y-6">
            <p className="inline-flex rounded-full bg-white/80 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-600">
              Live Multiplayer Grid
            </p>
            <h2 className="text-4xl font-black leading-tight sm:text-5xl">
              Capture tiles in real-time with everyone watching.
            </h2>
            <p className="max-w-xl text-base text-slate-700 sm:text-lg">
              Claim open tiles, race the leaderboard, and see every move update instantly across browsers.
            </p>
            <Link
              to="/login"
              className="inline-block rounded-xl bg-slate-900 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:-translate-y-0.5 hover:bg-slate-700"
            >
              Create Account
            </Link>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-xl backdrop-blur">
            <div className="grid grid-cols-8 gap-2">
              {Array.from({ length: 64 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-square rounded-md transition hover:scale-105"
                  style={{
                    backgroundColor:
                      index % 5 === 0
                        ? "#0ea5e9"
                        : index % 5 === 1
                          ? "#22c55e"
                          : index % 5 === 2
                            ? "#f59e0b"
                            : index % 5 === 3
                              ? "#ef4444"
                              : "#a78bfa",
                    opacity: index % 3 === 0 ? 1 : 0.65,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <footer className="pt-6 text-center text-sm font-medium text-slate-600">
          Made by Faraz Ghani
        </footer>
      </section>
    </main>
  );
}
