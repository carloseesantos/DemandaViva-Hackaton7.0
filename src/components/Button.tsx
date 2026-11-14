import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'critical';

const CLASS: Record<Variant, string> = {
  primary: 'dv-btn dv-btn--primary',
  secondary: 'dv-btn dv-btn--secondary',
  tertiary: 'dv-btn dv-btn--tertiary',
  critical: 'dv-btn dv-btn--critical',
};

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  return (
    <button type="button" className={`${CLASS[variant]} dv-focusable ${className}`.trim()} {...rest}>
      {children}
    </button>
  );
}
