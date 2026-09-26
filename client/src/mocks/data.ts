import type { Investigation, Repository } from '../types';
import { runRepositoryExplorer } from '../agents/repositoryExplorer.agent';
import { runRootCauseInvestigator } from '../agents/rootCauseInvestigator.agent';
import { runFixPlanner } from '../agents/fixPlanner.agent';
import { runFixer } from '../agents/fixer.agent';
import { runVerification } from '../agents/verification.agent';

export const demoRepository: Repository = { id: 'repo-api-gateway', name: 'acme-corp/api-gateway', language: 'TypeScript', fileCount: 86, testCount: 24, status: 'Analyzed', lastAnalyzed: 'Today, 09:42', branch: 'main' };
export const demoProblem = { title: 'Intermittent 401 Unauthorized after token refresh', description: 'Users are intermittently receiving 401 Unauthorized responses when making API requests immediately after their access token is refreshed. The issue does not happen on every request and appears to be related to the timing between token refresh and API authentication. This causes failed requests and requires users to retry the operation.', severity: 'High' as const };
const now = new Date().toISOString();
const activities = (): Investigation['activities'] => [
  { key: 'repo-explorer', name: 'Repository Explorer', status: 'pending', description: 'Waiting to analyze repository structure' },
  { key: 'root-cause', name: 'Root Cause Investigator', status: 'pending', description: 'Waiting for repository context' },
  { key: 'fix-planner', name: 'Fix Planner', status: 'pending', description: 'Waiting for root cause analysis' },
  { key: 'approval', name: 'Developer Approval', status: 'waiting', description: 'Review the proposed implementation' },
  { key: 'fixer', name: 'Fixer Agent', status: 'pending', description: 'Waiting for approval' },
  { key: 'verification', name: 'Verification Agent', status: 'pending', description: 'Waiting for changes to be applied' },
];
const explorer = runRepositoryExplorer(demoRepository, demoProblem);
const rootCause = runRootCauseInvestigator(demoProblem, explorer);
const fixPlan = runFixPlanner(rootCause, explorer);
const fixer = runFixer(fixPlan);
const verification = runVerification();
const completedActivities = activities().map((a) => ({ ...a, status: 'completed' as const, description: a.key === 'repo-explorer' ? 'Repository analyzed' : a.key === 'root-cause' ? 'Root cause identified' : a.key === 'fix-planner' ? 'Fix plan created' : a.key === 'approval' ? 'Fix approved by developer' : a.key === 'fixer' ? 'Changes applied' : 'Verification completed' }));
export const seededInvestigations: Investigation[] = [
  { id: 'demo-401', repositoryId: demoRepository.id, problem: demoProblem, status: 'verified', createdAt: now, updatedAt: now, activities: completedActivities, explorer, rootCause, fixPlan, fixer, verification, finalReport: { generatedAt: now, summary: 'The token refresh race condition was fixed and all verification checks passed.' } },
  { id: 'demo-cache', repositoryId: demoRepository.id, problem: { title: 'Stale cache headers on profile endpoint', description: 'Profile responses remain stale after an account update.', severity: 'Medium' }, status: 'awaiting-approval', createdAt: now, updatedAt: now, activities: activities().map((a) => a.key === 'repo-explorer' || a.key === 'root-cause' || a.key === 'fix-planner' ? { ...a, status: 'completed' as const, description: 'Complete' } : a), rootCause: { rootCause: 'Cache-Control headers are inherited from the gateway default.', evidence: ['src/api/profile.ts sets no cache policy', 'Gateway default is max-age=300'], affectedFiles: ['src/api/profile.ts', 'src/middleware/cache.ts'], affectedComponents: ['Profile API', 'Cache middleware'], confidence: 0.91 } },
];
