import type { InvestigationStatus } from '../types';
export function statusLabel(status: InvestigationStatus): string { return ({ draft: 'Draft', investigating: 'Investigating', 'awaiting-approval': 'Awaiting approval', approved: 'Approved', applying: 'Applying fix', verifying: 'Verifying', verified: 'Verified', failed: 'Failed' })[status]; }
export function formatDate(value?: string): string { return value ? new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }).format(new Date(value)) : '—'; }
