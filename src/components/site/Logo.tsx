import logo from "@/assets/sautiapex-logo.png";
import { Link } from "@tanstack/react-router";
import type { MouseEventHandler } from "react";

export function Logo({
  variant = "dark",
  compact = false,
  onClick,
}: {
  variant?: "dark" | "light";
  compact?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-3 group">
      <img
        src={logo}
        alt="SautiApex Capital Ventures Limited"
        className="h-12 w-12 object-contain drop-shadow-[0_2px_8px_rgba(201,168,76,0.35)] transition-transform group-hover:scale-105"
      />
      {!compact && (
        <div className="leading-tight">
          <div
            className={`font-serif text-lg font-semibold tracking-tight ${variant === "light" ? "text-brand-cream" : "text-brand-navy"}`}
          >
            Sauti<span className="text-gold-gradient">Apex</span>
          </div>
          <div
            className={`text-[10px] font-medium tracking-[0.18em] uppercase ${variant === "light" ? "text-brand-cream/60" : "text-muted-foreground"}`}
          >
            Capital Ventures Ltd
          </div>
        </div>
      )}
    </Link>
  );
}
