import Logo from "../assets/logo.png";
import { useEffect, useState } from "react";

const STEPS = [
  { label: "Loading projects", done: true },
  { label: "Initializing experience timeline", done: true },
  { label: "Compiling skills & tools", done: false, active: true },
  { label: "Preparing case studies", done: false },
  { label: "Launching portfolio", done: false },
];

const BUILD_LABEL = "deploy-2026";

export default function LoadingPage() {
  const [tick, setTick] = useState(0);
  const [progress, setProgress] = useState(35);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);

      setProgress((p) => {
        if (p >= 95) return p;
        return p + Math.random() * 2;
      });
    }, 800);

    // simulate finish
    const finishTimer = setTimeout(() => {
      setProgress(100);
      setCompleted(true);
    }, 4500);

    // redirect after complete
    const redirectTimer = setTimeout(() => {
      window.location.href = "/"; // change if needed
    }, 5200);

    return () => {
      clearInterval(interval);
      clearTimeout(finishTimer);
      clearTimeout(redirectTimer);
    };
  }, []);

  const dots = ".".repeat((tick % 3) + 1).padEnd(3, "\u00a0");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] text-white px-6 font-sans">
      <div className="w-full max-w-120 space-y-3">

        {/* HEADER */}
        <div className="rounded-md border border-[#30363d] bg-[#161b22] overflow-hidden">
          <div className="flex items-center gap-3 border-b border-[#30363d] px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#21262d] ring-1 ring-[#30363d]">
              <img src={Logo} alt="Logo" className="h-5 w-5 object-contain" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#e6edf3] leading-none">
                JAnMors<span className="text-[#8b949e]">/</span>portfolio
              </p>
              <p className="text-xs text-[#8b949e] mt-0.5">
                build{" "}
                <span className="font-mono text-[#58a6ff]">{BUILD_LABEL}</span>
              </p>
            </div>

            <span className="flex items-center gap-1.5 text-xs text-[#3fb950] bg-[#0d1117] border border-[#238636]/50 rounded-full px-2.5 py-0.5 font-medium">
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#3fb950]"
                style={{ animation: "pulse-dot 1.8s ease-in-out infinite" }}
              />
              {completed ? "Ready" : "Booting"}
            </span>
          </div>

          {/* PROGRESS */}
          <div className="px-4 pt-4 pb-1">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-[#8b949e] font-mono">
                Initializing portfolio{dots}
              </span>
              <span className="text-xs font-mono text-[#58a6ff]">
                {Math.round(progress)}%
              </span>
            </div>

            <div className="h-1.5 w-full rounded-full bg-[#21262d] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#238636] transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* STEPS */}
          <div className="px-4 py-3 space-y-2">
            {STEPS.map((step, i) => (
              <div key={i} className="flex items-center gap-2.5">
                {step.done ? (
                  <CheckIcon />
                ) : step.active && !completed ? (
                  <SpinnerIcon />
                ) : (
                  <IdleIcon />
                )}

                <span
                  className={`text-xs font-mono ${
                    step.done
                      ? "text-[#8b949e]"
                      : step.active && !completed
                      ? "text-[#e6edf3]"
                      : "text-[#484f58]"
                  }`}
                >
                  {step.label}
                  {step.active && !completed && (
                    <span className="text-[#8b949e]">{dots}</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* LOGS */}
        <div className="rounded-md border border-[#30363d] bg-[#0d1117] px-4 py-3 font-mono text-xs text-[#8b949e] space-y-1.5">
          <LogLine tick={tick} delay={0} prefix="info" text="Loading featured projects" />
          <LogLine tick={tick} delay={1} prefix="info" text="Hydrating portfolio data" />
          <LogLine tick={tick} delay={2} prefix="warn" text="Optimizing large media assets" />
          <LogLine tick={tick} delay={3} prefix="info" text="Compiling skills & technologies" />
          {tick >= 4 && (
            <LogLine tick={tick} delay={4} prefix="info" text="Finalizing UI components..." />
          )}
        </div>

        <p className="text-center text-[10px] font-mono text-[#484f58]">
          Built with React · TypeScript · Tailwind
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}

/* ICONS */

function CheckIcon() {
  return (
    <svg className="h-4 w-4 text-[#3fb950]" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="h-4 w-4 text-[#58a6ff]"
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: "spin 1.2s linear infinite" }}
    >
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IdleIcon() {
  return (
    <svg className="h-4 w-4 text-[#30363d]" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/* LOG LINE */

function LogLine({
  tick,
  delay,
  prefix,
  text,
}: {
  tick: number;
  delay: number;
  prefix: "info" | "warn";
  text: string;
}) {
  if (tick < delay) return null;

  const time = new Date();
  time.setSeconds(time.getSeconds() - (4 - delay));

  const hh = String(time.getHours()).padStart(2, "0");
  const mm = String(time.getMinutes()).padStart(2, "0");
  const ss = String(time.getSeconds()).padStart(2, "0");

  return (
    <div className="flex gap-2">
      <span className="text-[#484f58]">{hh}:{mm}:{ss}</span>
      <span className={prefix === "warn" ? "text-[#d29922]" : "text-[#3fb950]"}>
        {prefix === "warn" ? "WARN" : "INFO"}
      </span>
      <span>{text}</span>
    </div>
  );
}