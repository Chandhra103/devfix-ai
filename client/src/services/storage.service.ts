import type { WorkflowState } from '../types';
const KEY = 'devfix-ai-state-v1';
const LEGACY_SEED_IDS = new Set(['demo-401', 'demo-cache', 'demo-checkout', 'demo-search']);
export function loadState(seed: WorkflowState): WorkflowState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as WorkflowState;
    const stored = parsed.investigations ?? [];
    const storedById = new Map(stored.map((item) => [item.id, item]));
    const seeded = seed.investigations.map((item) => storedById.get(item.id) ?? item);
    const userInvestigations = stored.filter((item) => !LEGACY_SEED_IDS.has(item.id) && !item.problem.title.includes('401 Unauthorized after token refresh'));
    return { ...parsed, repositories: seed.repositories, investigations: [...seeded, ...userInvestigations] };
  } catch {
    return seed;
  }
}
export function saveState(state: WorkflowState): void { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* demo remains usable if storage is unavailable */ } }
export function clearState(): void { localStorage.removeItem(KEY); }
