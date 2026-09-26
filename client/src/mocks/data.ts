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
const checkoutProblem = { title: 'Checkout fails when the cart is empty', description: 'The checkout endpoint returns a 500 error when a customer submits an empty cart instead of returning a clear validation response.', severity: 'High' as const };
const checkoutExplorer = runRepositoryExplorer(demoRepository, checkoutProblem);
const checkoutRootCause = { rootCause: 'The checkout controller assumes the cart line-items array contains at least one item before calculating totals.', evidence: ['src/api/checkout.ts calls reduce() without an empty-cart guard', 'Checkout validation currently runs after total calculation', 'The API returns an unhandled TypeError for empty carts'], affectedFiles: ['src/api/checkout.ts', 'src/middleware/validation.ts', 'tests/checkout.test.ts'], affectedComponents: ['Checkout API', 'Cart validation', 'Order totals'], confidence: 0.94 };
const checkoutPlan = { filesToModify: ['src/api/checkout.ts', 'src/middleware/validation.ts', 'tests/checkout.test.ts'], changes: ['Validate that the cart contains at least one line item before calculating totals', 'Return a 422 validation response for empty carts', 'Add regression coverage for the empty-cart checkout request'], steps: ['Add an explicit empty-cart guard', 'Return a descriptive validation error', 'Keep total calculation unchanged for valid carts', 'Add an empty-cart regression test'], risks: ['Client integrations must handle the new 422 response', 'Validation must not reject carts with valid promotional adjustments'], testsToRun: ['tests/checkout.test.ts', 'tests/cart-validation.test.ts'], expectedResult: 'Empty carts fail fast with a clear validation response instead of a server error.' };
const approvedActivities = activities().map((a) => ({ ...a, status: a.key === 'repo-explorer' || a.key === 'root-cause' || a.key === 'fix-planner' || a.key === 'approval' ? 'completed' as const : 'pending' as const, description: a.key === 'repo-explorer' ? 'Repository analyzed' : a.key === 'root-cause' ? 'Empty-cart failure identified' : a.key === 'fix-planner' ? 'Checkout fix plan created' : a.key === 'approval' ? 'Fix approved by developer' : a.description }));
const investigatingActivities = activities().map((a) => a.key === 'repo-explorer' ? { ...a, status: 'running' as const, description: 'Tracing search request latency across API paths' } : a);
export const seededInvestigations: Investigation[] = [
  { id: 'demo-401', repositoryId: demoRepository.id, problem: demoProblem, status: 'verified', createdAt: now, updatedAt: now, activities: completedActivities, explorer, rootCause, fixPlan, fixer, verification, finalReport: { generatedAt: now, summary: 'The token refresh race condition was fixed and all verification checks passed.' } },
  { id: 'demo-checkout', repositoryId: demoRepository.id, problem: checkoutProblem, status: 'approved', createdAt: now, updatedAt: now, activities: approvedActivities, explorer: checkoutExplorer, rootCause: checkoutRootCause, fixPlan: checkoutPlan },
  { id: 'demo-search', repositoryId: demoRepository.id, problem: { title: 'Slow API response during product search', description: 'Product search takes several seconds for broad queries because filtering and ranking are performed after the full catalog is loaded into memory.', severity: 'Medium' }, status: 'investigating', createdAt: now, updatedAt: now, activities: investigatingActivities, explorer: { ...explorer, summary: 'Repository Explorer is tracing the product search request path and profiling catalog access.', relevantFiles: ['src/api/search.ts', 'src/catalog/productIndex.ts', 'src/middleware/timing.ts'], codePaths: ['search request → catalog lookup → ranking middleware'], components: ['Product Search API', 'Catalog Index', 'Timing Middleware'] } },
];
