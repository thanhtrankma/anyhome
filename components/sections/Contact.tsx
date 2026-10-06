"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Clock, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Reveal, SectionHeading } from "@/components/site/motion";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitLead } from "@/lib/actions/leads";
import { leadProjectTypeLabels } from "@/lib/data";
import type { SiteSettings } from "@/lib/types";
import { BUDGET_OPTIONS, leadSchema, type LeadFormValues, type LeadInput } from "@/lib/validations/lead";

const defaultValues: LeadFormValues = {
  name: "",
  phone: "",
  email: "",
  projectType: "residential",
  area: "",
  budget: "",
  message: "",
  website: "",
};

const budgetItems = Object.fromEntries(BUDGET_OPTIONS.map((b) => [b, b]));

export function Contact({ settings }: { settings: SiteSettings }) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const form = useForm<LeadFormValues, unknown, LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues,
    mode: "onTouched",
  });

  const onSubmit = form.handleSubmit((values) =>
    startTransition(async () => {
      const res = await submitLead(values);
      if (!res.ok) {
        Object.entries(res.fieldErrors ?? {}).forEach(([k, msgs]) =>
          form.setError(k as keyof LeadFormValues, { message: msgs[0] }),
        );
        toast.error(res.error);
        return;
      }
      setDone(true);
      form.reset(defaultValues);
      toast.success("Đã gửi yêu cầu! Anyhome sẽ liên hệ trong vòng 24 giờ.");
    }),
  );

  const tel = settings.hotline.replace(/\s/g, "");

  return (
    <section id="contact" className="relative overflow-hidden bg-navy-950 py-24 text-white sm:py-32">
      <div className="pointer-events-none absolute -bottom-40 -left-40 size-[520px] rotate-45 bg-gold-300/[0.06]" aria-hidden />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-[1fr_1.15fr] lg:px-8">
        <div>
          <SectionHeading
            tone="light"
            eyebrow="Liên hệ & Báo giá"
            title="Bắt đầu công trình mang “chất riêng” của bạn"
            description="Để lại thông tin — kiến trúc sư Anyhome sẽ tư vấn phương án và gửi báo giá sơ bộ miễn phí trong vòng 24 giờ làm việc."
          />

          <Reveal className="mt-10 space-y-5">
            <a href={`tel:${tel}`} className="group flex items-center gap-4">
              <span className="grid size-12 place-items-center rounded-full bg-gold-300 text-navy-900 transition-transform group-hover:scale-110">
                <Phone className="size-5" />
              </span>
              <span>
                <span className="block text-xs tracking-widest text-navy-300 uppercase">Hotline 24/7</span>
                <span className="text-2xl font-bold text-gold-200">{settings.hotline}</span>
              </span>
            </a>
            <ul className="space-y-4 text-sm text-navy-100">
              <li className="flex gap-3">
                <Mail className="size-5 shrink-0 text-gold-300" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold-200">
                  {settings.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="size-5 shrink-0 text-gold-300" />
                <span>
                  <strong className="font-medium text-white">Văn phòng Hà Nội:</strong> {settings.officeAddress}
                </span>
              </li>
              <li className="flex gap-3">
                <MapPin className="size-5 shrink-0 text-gold-300" />
                <span>
                  <strong className="font-medium text-white">Chi nhánh Hải Phòng:</strong> {settings.branchAddress}
                </span>
              </li>
              <li className="flex gap-3">
                <Clock className="size-5 shrink-0 text-gold-300" />
                Thứ 2 – Thứ 7 · 8:00 – 17:30
              </li>
            </ul>
          </Reveal>

          <Reveal className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <iframe
              title="Bản đồ văn phòng Anyhome"
              src={`https://www.google.com/maps?q=${encodeURIComponent(settings.mapQuery)}&output=embed`}
              className="h-64 w-full grayscale-[.3] invert-[.9] hue-rotate-180 sm:h-72"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>

        <Reveal className="theme-light relative rounded-2xl bg-white p-6 text-foreground shadow-2xl sm:p-10">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[520px] flex-col items-center justify-center text-center"
              >
                <CheckCircle2 className="size-16 text-gold-500" strokeWidth={1.4} />
                <h3 className="mt-6 text-2xl font-bold text-navy-900">Cảm ơn bạn đã tin tưởng Anyhome!</h3>
                <p className="mt-3 max-w-sm text-muted-foreground">
                  Yêu cầu đã được ghi nhận. Chuyên viên tư vấn sẽ gọi lại cho bạn sớm nhất.
                </p>
                <Button variant="outline" className="mt-8 rounded-full" onClick={() => setDone(false)}>
                  Gửi yêu cầu khác
                </Button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={onSubmit} noValidate>
                <h3 className="text-2xl font-bold text-navy-900">Đăng ký nhận báo giá</h3>
                <p className="mt-1 text-sm text-muted-foreground">Các trường có dấu * là bắt buộc.</p>

                <FieldGroup className="mt-8 grid gap-5 sm:grid-cols-2">
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lead-name">Họ và tên *</FieldLabel>
                        <Input {...field} id="lead-name" autoComplete="name" placeholder="Nguyễn Văn A" aria-invalid={fieldState.invalid} className="h-11" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="phone"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lead-phone">Số điện thoại *</FieldLabel>
                        <Input {...field} id="lead-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="09xx xxx xxx" aria-invalid={fieldState.invalid} className="h-11" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                        <FieldLabel htmlFor="lead-email">Email</FieldLabel>
                        <Input {...field} id="lead-email" type="email" autoComplete="email" placeholder="email@congty.vn" aria-invalid={fieldState.invalid} className="h-11" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="projectType"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lead-type">Loại công trình *</FieldLabel>
                        <Select items={leadProjectTypeLabels} value={field.value} onValueChange={(v) => v && field.onChange(v)}>
                          <SelectTrigger id="lead-type" className="h-11! w-full" aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Chọn loại công trình" />
                          </SelectTrigger>
                          <SelectContent className="theme-light">
                            {Object.entries(leadProjectTypeLabels).map(([value, label]) => (
                              <SelectItem key={value} value={value}>
                                {label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="area"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="lead-area">Diện tích dự kiến</FieldLabel>
                        <Input {...field} id="lead-area" placeholder="VD: 250 m²" className="h-11" />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name="budget"
                    control={form.control}
                    render={({ field }) => (
                      <Field className="sm:col-span-2">
                        <FieldLabel htmlFor="lead-budget">Ngân sách dự kiến</FieldLabel>
                        <Select items={budgetItems} value={field.value || null} onValueChange={(v) => field.onChange(v ?? "")}>
                          <SelectTrigger id="lead-budget" className="h-11! w-full">
                            <SelectValue placeholder="Chọn khoảng ngân sách" />
                          </SelectTrigger>
                          <SelectContent className="theme-light">
                            {BUDGET_OPTIONS.map((b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                    )}
                  />
                  <Controller
                    name="message"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                        <FieldLabel htmlFor="lead-message">Mô tả nhu cầu</FieldLabel>
                        <Textarea {...field} id="lead-message" rows={4} placeholder="Vị trí khu đất, số tầng, phong cách mong muốn…" aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </FieldGroup>

                {/* Honeypot */}
                <input {...form.register("website")} type="text" tabIndex={-1} autoComplete="off" aria-hidden className="absolute -left-[9999px] h-0 w-0 opacity-0" />

                <Button type="submit" disabled={pending} className="mt-8 h-13 w-full rounded-full bg-navy-900 text-base font-semibold text-white hover:bg-navy-800">
                  {pending ? <Loader2 className="animate-spin" /> : <Send />}
                  {pending ? "Đang gửi…" : "Gửi yêu cầu báo giá"}
                </Button>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Thông tin của bạn được bảo mật và chỉ dùng để tư vấn dự án.
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  );
}
