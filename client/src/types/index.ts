export type Severity = 'Low' | 'Medium' | 'High' | 'Critical';
export type AgentStatus = 'pending' | 'running' | 'completed' | 'failed' | 'waiting';
export type InvestigationStatus = 'draft' | 'investigating' | 'awaiting-approval' | 'approved' | 'applying' | 'verifying' | 'verified' | 'failed';
export type AgentKey = 'repo-explorer' | 'root-cause' | 'fix-planner' | 'fixer' | 'verification';

export interface Repository { id: string; name: string; language: string; fileCount: number; testCount: number; status: 'Analyzed' | 'Needs analysis' | 'Offline'; lastAnalyzed: string; branch: string; }
export interface Problem { title: string; description: string; severity: Severity; }
export interface AgentActivity { key: AgentKey | 'approval'; name: string; status: AgentStatus; description: string; startedAt?: string; completedAt?: string; }
export interface RepoExplorerOutput { summary: string; relevantFiles: string[]; codePaths: string[]; dependencies: string[]; testsFound: string[]; components: string[]; }
export interface RootCauseOutput { rootCause: string; evidence: string[]; affectedFiles: string[]; affectedComponents: string[]; confidence: number; }
export interface FixPlanOutput { filesToModify: string[]; changes: string[]; steps: string[]; risks: string[]; testsToRun: string[]; expectedResult: string; }
export interface DiffFile { path: string; before: string[]; after: string[]; }
export interface FixerOutput { modifiedFiles: string[]; changesApplied: string[]; diff: DiffFile[]; summary: string; }
export interface VerificationCheck { name: string; status: 'pass' | 'fail'; detail: string; duration: string; }
export interface VerificationOutput { checks: VerificationCheck[]; overall: 'verified' | 'failed'; remainingIssues: string[]; }
export interface FinalReport { generatedAt: string; summary: string; }
export interface Investigation { id: string; repositoryId: string; problem: Problem; status: InvestigationStatus; createdAt: string; updatedAt: string; activities: AgentActivity[]; explorer?: RepoExplorerOutput; rootCause?: RootCauseOutput; fixPlan?: FixPlanOutput; fixer?: FixerOutput; verification?: VerificationOutput; finalReport?: FinalReport; error?: string; }
export interface WorkflowState { repositories: Repository[]; investigations: Investigation[]; activeInvestigationId?: string; }
