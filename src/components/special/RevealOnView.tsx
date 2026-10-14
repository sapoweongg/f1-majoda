"use client";

import { useRef, type ReactNode } from "react";
import { useInView } from "motion/react";

/** Marca data-visible="true" cuando el bloque entra en pantalla (dispara animaciones CSS). */
export function RevealOnView({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  return (
    <div ref={ref} data-visible={visible} className={className}>
      {children}
    </div>
  );
}
