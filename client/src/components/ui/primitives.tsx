import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';
export function Card({ children, className = '', ...props }: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) { return <div className={cn('panel', className)} {...props}>{children}</div>; }
export function Button({ children, className = '', variant = 'primary', ...props }: { children: ReactNode; className?: string; variant?: 'primary' | 'secondary' | 'ghost' | 'danger' } & ButtonHTMLAttributes<HTMLButtonElement>) { return <button className={cn('button', `button-${variant}`, className)} {...props}>{children}</button>; }
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'blue' | 'green' | 'amber' | 'red' }) { return <span className={`badge badge-${tone}`}>{children}</span>; }
export function ProgressBar({ value }: { value: number }) { return <div className="progress-track"><div className="progress-value" style={{ width: `${value}%` }} /></div>; }
export function SectionHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) { return <div className="section-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{description && <p>{description}</p>}</div>{action}</div>; }
