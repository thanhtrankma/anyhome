"use client";

import { CircleAlert, Eye, EyeOff, Loader2, LockKeyhole, LogIn, UserRound } from "lucide-react";
import { useActionState, useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { login, type LoginState } from "@/lib/actions/auth";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="mt-8">
      {next && <input type="hidden" name="next" value={next} />}

      {state.error && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </div>
      )}

      <FieldGroup>
        <Field data-invalid={!!state.error}>
          <FieldLabel htmlFor="username">Tên đăng nhập</FieldLabel>
          <div className="relative">
            <UserRound className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="username"
              name="username"
              autoComplete="username"
              autoFocus
              required
              defaultValue={state.username}
              aria-invalid={!!state.error}
              className="h-11 pl-10"
            />
          </div>
        </Field>

        <Field data-invalid={!!state.error}>
          <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              aria-invalid={!!state.error}
              className="h-11 pr-11 pl-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              aria-pressed={showPassword}
              className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </Button>
          </div>
        </Field>

        <Field orientation="horizontal">
          <Checkbox id="remember" name="remember" />
          <FieldLabel htmlFor="remember" className="font-normal">
            Ghi nhớ đăng nhập trong 30 ngày
          </FieldLabel>
        </Field>

        <Button type="submit" size="lg" className="h-11 w-full" disabled={pending}>
          {pending ? <Loader2 className="animate-spin" /> : <LogIn />}
          {pending ? "Đang đăng nhập…" : "Đăng nhập"}
        </Button>
      </FieldGroup>
    </form>
  );
}
