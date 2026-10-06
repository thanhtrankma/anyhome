/** Icon mạng xã hội (lucide v1 đã bỏ icon thương hiệu). Hình theo Simple Icons — CC0. */
type IconProps = { className?: string };

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M9.1 23.7v-8H6.6V12h2.5v-1.6c0-4.1 1.9-6 5.9-6 .8 0 2.1.2 2.7.3v3.3h-1.4c-2 0-2.8.8-2.8 2.7V12h4l-.7 3.7h-3.3v8.1C19.5 23 24 18 24 12 24 5.4 18.6 0 12 0S0 5.4 0 12c0 5.6 3.9 10.4 9.1 11.7Z" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
    </svg>
  );
}

export function TiktokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.5.02C13.8 0 15.1.01 16.4 0c.1 1.5.6 3.1 1.8 4.2 1.1 1.1 2.7 1.6 4.2 1.8v4c-1.4 0-2.9-.3-4.2-1-.6-.3-1.1-.6-1.6-.9v8.8c0 1.4-.4 2.8-1.2 4-1.3 1.9-3.5 3.1-5.8 3.1-1.4.1-2.8-.3-4-1-2-1.2-3.4-3.3-3.6-5.6v-1.5c.2-1.9 1.1-3.7 2.6-4.9 1.7-1.4 4-2.1 6.1-1.7v4.1c-1-.3-2.1-.2-3 .3-.6.4-1.1 1-1.4 1.7-.2.5-.2 1.1-.1 1.7.3 1.7 1.9 3.1 3.6 2.9 1.2 0 2.2-.7 2.8-1.6.2-.3.4-.7.4-1.1.1-1.8.1-3.6.1-5.4V.02Z" />
    </svg>
  );
}
