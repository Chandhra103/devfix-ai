import type { WorkflowState } from '../types';
const KEY = 'devfix-ai-state-v1';
export function loadState(seed: WorkflowState): WorkflowState { try { const raw = localStorage.getItem(KEY); if (!raw) return seed; const parsed = JSON.parse(raw) as WorkflowState; const seedDemo = seed.investigations.find((item) => item.id === 'demo-401'); return { ...parsed, repositories: parsed.repositories?.length ? parsed.repositories : seed.repositories, investigations: parsed.investigations?.map((item) => item.id === 'demo-401' && !item.fixPlan && seedDemo ? seedDemo : item) ?? seed.investigations }; } catch { return seed; } }
export function saveState(state: WorkflowState): void { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* demo remains usable if storage is unavailable */ } }
export function clearState(): void { localStorage.removeItem(KEY); }
