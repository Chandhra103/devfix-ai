import { Check, Circle, Clock3, Code2, FileSearch, GitPullRequest, ShieldCheck, UserCheck, X } from 'lucide-react';
import type { AgentActivity } from '../../types';

const icons = { 'repo-explorer': FileSearch, 'root-cause': Code2, 'fix-planner': GitPullRequest, approval: UserCheck, fixer: Code2, verification: ShieldCheck };

function statusForCard(status: AgentActivity['status']): { label: 'Pending' | 'Running' | 'Complete'; className: string; icon: typeof Check } {
  if (status === 'completed') return { label: 'Complete', className: 'complete', icon: Check };
  if (status === 'running') return { label: 'Running', className: 'running', icon: Circle };
  if (status === 'failed') return { label: 'Pending', className: 'pending', icon: X };
  return { label: 'Pending', className: 'pending', icon: status === 'waiting' ? Clock3 : Circle };
}

export function AgentStageCards({ activities }: { activities: AgentActivity[] }) {
  return <div className="agent-stage-cards">{activities.map((activity, index) => {
    const Icon = icons[activity.key];
    const status = statusForCard(activity.status);
    const StatusIcon = status.icon;
    return <div className={`agent-stage-card stage-${status.className}`} key={activity.key}>
      <div className="agent-stage-index">0{index + 1}</div>
      <div className="agent-stage-icon"><Icon size={18} /></div>
      <div className="agent-stage-content"><strong>{activity.name}</strong><span>{activity.description}</span></div>
      <div className={`agent-stage-status ${status.className}`}><StatusIcon size={12} />{status.label}</div>
    </div>;
  })}</div>;
}
