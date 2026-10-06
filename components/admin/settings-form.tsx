"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateSettings } from "@/lib/actions/settings";
import { settingsSchema, type SettingsInput } from "@/lib/validations/settings";

const CONTACT_FIELDS: { name: Exclude<keyof SettingsInput, "stats">; label: string; full?: boolean }[] = [
  { name: "hotline", label: "Hotline" },
  { name: "zalo", label: "Số Zalo" },
  { name: "email", label: "Email nhận liên hệ", full: true },
  { name: "officeAddress", label: "Văn phòng Hà Nội", full: true },
  { name: "branchAddress", label: "Chi nhánh Hải Phòng", full: true },
  { name: "mapQuery", label: "Địa chỉ hiển thị Google Maps", full: true },
];

export function SettingsForm({ defaultValues }: { defaultValues: SettingsInput }) {
  const [pending, startTransition] = useTransition();
  const form = useForm<SettingsInput>({ resolver: zodResolver(settingsSchema), defaultValues, mode: "onTouched" });

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const res = await updateSettings(values);
          if (res.ok) {
            toast.success("Đã lưu cài đặt");
            form.reset(values);
          } else toast.error(res.error);
        }),
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Thông tin liên hệ</CardTitle>
          <CardDescription>Hiển thị ở header, footer, thanh liên hệ nhanh trên di động và mục Liên hệ.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup className="grid gap-5 sm:grid-cols-2">
            {CONTACT_FIELDS.map((f) => (
              <Controller
                key={f.name}
                name={f.name}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className={f.full ? "sm:col-span-2" : undefined}>
                    <FieldLabel htmlFor={`s-${f.name}`}>{f.label}</FieldLabel>
                    <Input {...field} id={`s-${f.name}`} aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            ))}
          </FieldGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Số liệu nổi bật (Hero)</CardTitle>
          <CardDescription>4 chỉ số hiển thị dưới banner trang chủ.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="grid grid-cols-[1fr_120px_72px] gap-3">
              <Controller
                name={`stats.${i}.label`}
                control={form.control}
                render={({ field }) => <Input {...field} aria-label={`Nhãn chỉ số ${i + 1}`} />}
              />
              <Controller
                name={`stats.${i}.value`}
                control={form.control}
                render={({ field }) => (
                  <Input
                    type="number"
                    aria-label={`Giá trị chỉ số ${i + 1}`}
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    onBlur={field.onBlur}
                  />
                )}
              />
              <Controller
                name={`stats.${i}.suffix`}
                control={form.control}
                render={({ field }) => <Input {...field} aria-label={`Hậu tố chỉ số ${i + 1}`} placeholder="+" />}
              />
            </div>
          ))}
        </CardContent>
        <CardFooter className="justify-end">
          <Button type="submit" disabled={pending || !form.formState.isDirty}>
            {pending ? <Loader2 className="animate-spin" /> : <Save />}
            Lưu cài đặt
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
