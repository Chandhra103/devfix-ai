import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Investigation, Problem, WorkflowState } from '../types';
import { demoRepository, seededInvestigations } from '../mocks/data';
import { loadState, saveState } from '../services/storage.service';
import { agentService } from '../services/agent.service';
interface SessionContextValue extends WorkflowState { active?: Investigation; loadDemo: () => void; createInvestigation: (repositoryId: string, problem: Problem) => Investigation; updateInvestigation: (investigation: Investigation) => void; runDiscovery: (id: string) => Promise<void>; approveFix: (id: string) => Promise<void>; applyFix: (id: string) => Promise<void>; verifyFix: (id: string) => Promise<void>; }
const SessionContext = createContext<SessionContextValue | null>(null);
const initial: WorkflowState = { repositories: [demoRepository], investigations: seededInvestigations };
const approveInvestigation = (investigation: Investigation): Investigation => ({ ...investigation, status: 'approved', updatedAt: new Date().toISOString(), activities: investigation.activities.map((activity) => activity.key === 'approval' ? { ...activity, status: 'completed', description: 'Fix approved by developer', completedAt: new Date().toISOString() } : activity) });
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WorkflowState>(() => loadState(initial));
  useEffect(() => saveState(state), [state]);
  const active = state.investigations.find((i) => i.id === state.activeInvestigationId);
  const updateInvestigation = (investigation: Investigation) => setState((current) => ({ ...current, investigations: current.investigations.map((item) => item.id === investigation.id ? investigation : item), activeInvestigationId: investigation.id }));
  const value = useMemo<SessionContextValue>(() => ({
    ...state,
    active,
    loadDemo: () => setState((current) => ({ ...current, activeInvestigationId: 'demo-401' })),
    createInvestigation: (repositoryId, problem) => { const id = `inv-${Date.now()}`; const investigation: Investigation = { id, repositoryId, problem, status: 'draft', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), activities: [{ key: 'repo-explorer', name: 'Repository Explorer', status: 'pending', description: 'Waiting to analyze repository structure' }, { key: 'root-cause', name: 'Root Cause Investigator', status: 'pending', description: 'Waiting for repository context' }, { key: 'fix-planner', name: 'Fix Planner', status: 'pending', description: 'Waiting for root cause analysis' }, { key: 'approval', name: 'Developer Approval', status: 'waiting', description: 'Review the proposed implementation' }, { key: 'fixer', name: 'Fixer Agent', status: 'pending', description: 'Waiting for approval' }, { key: 'verification', name: 'Verification Agent', status: 'pending', description: 'Waiting for changes to be applied' }] }; setState((current) => ({ ...current, investigations: [investigation, ...current.investigations], activeInvestigationId: id })); return investigation; },
    updateInvestigation,
    runDiscovery: async (id) => { const current = state.investigations.find((item) => item.id === id); if (current) await agentService.discover(current, updateInvestigation); },
    approveFix: async (id) => { const current = state.investigations.find((item) => item.id === id); if (!current || !current.fixPlan) return; const approved = approveInvestigation(current); updateInvestigation(approved); const applied = await agentService.apply(approved, updateInvestigation); await agentService.verify(applied, updateInvestigation); },
    applyFix: async (id) => { const current = state.investigations.find((item) => item.id === id); if (!current || !current.fixPlan) return; const applied = await agentService.apply(current, updateInvestigation); await agentService.verify(applied, updateInvestigation); },
    verifyFix: async (id) => { const current = state.investigations.find((item) => item.id === id); if (current) await agentService.verify(current, updateInvestigation); },
  }), [state, active]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
export function useSession() { const ctx = useContext(SessionContext); if (!ctx) throw new Error('useSession must be used inside SessionProvider'); return ctx; }
