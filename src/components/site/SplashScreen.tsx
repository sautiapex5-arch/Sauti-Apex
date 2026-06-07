import { useEffect, useState } from "react";
import logo from "@/assets/sautiapex-logo.png";

const FLAG = "sautiapex.splash.show";

/** Call right after a successful sign-in/sign-up to arm the splash once. */
export function armSplash() {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(FLAG, "1");
  }
}

export function SplashScreen({ always = false }: { always?: boolean } = {}) {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!always) {
      if (sessionStorage.getItem(FLAG) !== "1") return;
      sessionStorage.removeItem(FLAG);
    }
    setShow(true);
    const leaveT = setTimeout(() => setLeaving(true), 1300);
    const doneT = setTimeout(() => setShow(false), 2000);
    return () => {
      clearTimeout(leaveT);
      clearTimeout(doneT);
    };
  }, [always]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-navy-gradient overflow-hidden transition-opacity duration-500 pointer-events-none ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
      aria-hidden="true"
    >
      {/* subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* gold sweep */}
      <div className="splash-sweep absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent skew-x-12" />

      {/* expanding rings */}
      <span className="splash-ring absolute h-40 w-40 rounded-full border border-brand-gold/40" />
      <span className="splash-ring splash-ring--2 absolute h-40 w-40 rounded-full border border-brand-gold/30" />
      <span className="splash-ring splash-ring--3 absolute h-40 w-40 rounded-full border border-brand-gold/20" />

      <div className="relative flex flex-col items-center text-center px-6">
        <div className="splash-logo relative">
          <div className="absolute inset-0 rounded-full bg-brand-gold/30 blur-2xl scale-110" />
          <img
            src={logo}
            alt=""
            className="relative h-24 w-24 object-contain drop-shadow-[0_4px_24px_rgba(201,168,76,0.55)]"
          />
        </div>

        <div className="splash-title mt-8 font-serif text-4xl md:text-5xl text-brand-cream tracking-tight">
          Sauti<span className="text-gold-gradient">Apex</span>
        </div>
        <div className="splash-sub mt-3 text-[11px] md:text-xs font-medium tracking-[0.32em] uppercase text-brand-cream/70">
          Capital Ventures
        </div>

        <div className="splash-bar mt-10 h-px w-48 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

        <div className="splash-tag mt-5 text-xs text-brand-cream/60 italic max-w-xs">
          “Systems outlive emotions. Structure outlives personalities.”
        </div>
      </div>

      <style>{`
        @keyframes splashLogoIn {
          0%   { opacity: 0; transform: scale(0.6) rotate(-8deg); }
          60%  { opacity: 1; transform: scale(1.08) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0); }
        }
        @keyframes splashRise {
          0%   { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes splashBar {
          0%   { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        @keyframes splashRing {
          0%   { opacity: 0.55; transform: scale(0.4); }
          100% { opacity: 0;    transform: scale(2.2); }
        }
        @keyframes splashSweep {
          0%   { transform: translateX(0) skewX(12deg); }
          100% { transform: translateX(420%) skewX(12deg); }
        }
        .splash-logo  { animation: splashLogoIn 900ms cubic-bezier(.2,.8,.2,1) both; }
        .splash-title { animation: splashRise 700ms ease-out 350ms both; }
        .splash-sub   { animation: splashRise 700ms ease-out 550ms both; }
        .splash-bar   { transform-origin: center; animation: splashBar 800ms ease-out 700ms both; }
        .splash-tag   { animation: splashRise 800ms ease-out 950ms both; }
        .splash-ring  { animation: splashRing 2200ms ease-out 200ms both; }
        .splash-ring--2 { animation-delay: 600ms; }
        .splash-ring--3 { animation-delay: 1000ms; }
        .splash-sweep { animation: splashSweep 2200ms ease-in-out 100ms both; }
      `}</style>
    </div>
  );
}
