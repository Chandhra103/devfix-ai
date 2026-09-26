import { describe, expect, it } from 'vitest';
import { runRepositoryExplorer } from '../../client/src/agents/repositoryExplorer.agent';
import { runRootCauseInvestigator } from '../../client/src/agents/rootCauseInvestigator.agent';
import { runFixPlanner } from '../../client/src/agents/fixPlanner.agent';
import { runFixer } from '../../client/src/agents/fixer.agent';
import { runVerification } from '../../client/src/agents/verification.agent';
import { demoRepository, demoProblem } from '../../client/src/mocks/data';
describe('DevFix demo agent chain', () => { it('passes structured output between all five agents', () => { const explorer = runRepositoryExplorer(demoRepository, demoProblem); const root = runRootCauseInvestigator(demoProblem, explorer); const plan = runFixPlanner(root, explorer); const fixer = runFixer(plan); const verification = runVerification(); expect(explorer.relevantFiles).toContain('src/auth/tokenManager.ts'); expect(root.confidence).toBeGreaterThan(.9); expect(plan.steps.length).toBeGreaterThan(3); expect(fixer.diff.length).toBe(3); expect(verification.overall).toBe('verified'); }); });
