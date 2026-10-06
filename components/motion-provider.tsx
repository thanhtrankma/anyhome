"use client";

import { MotionConfig } from "framer-motion";

/** ui-ux-pro-max · reduced-motion: mọi animation Framer Motion tôn trọng cài đặt hệ điều hành. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
