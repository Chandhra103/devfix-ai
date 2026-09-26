import { AlertTriangle, GitBranch } from 'lucide-react';
import type { Investigation, Repository } from '../../types';
import { Badge, Card } from '../ui/primitives';
export function ProblemCard({ investigation, repository }: { investigation: Investigation; repository?: Repository }) { return <Card className="problem-card"><div className="problem-top"><Badge tone="amber">{investigation.problem.severity} severity</Badge><span className="mono-label"><GitBranch size={13} /> {repository?.branch ?? 'main'}</span></div><h1>{investigation.problem.title}</h1><p>{investigation.problem.description}</p><div className="problem-meta"><span><AlertTriangle size={14} /> {repository?.name ?? 'Unknown repository'}</span><span>Reported just now</span></div></Card>; }
