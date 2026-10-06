import { z } from "zod";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export const ok = <T>(data: T): ActionResult<T> => ({ ok: true, data });

export const fail = (error: string, zodError?: z.ZodError): ActionResult<never> => {
  if (!zodError) return { ok: false, error };
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of zodError.issues) {
    const key = issue.path.join(".") || "_form";
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return { ok: false, error, fieldErrors };
};
