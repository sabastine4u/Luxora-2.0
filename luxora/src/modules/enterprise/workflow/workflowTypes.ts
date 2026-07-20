// src/modules/enterprise/workflow/workflowTypes.ts
import type { EnterpriseEvent } from '../events/types';

export type WorkflowStatus = 'pending' | 'completed' | 'failed' | 'rejected' | 'approved';

export interface WorkflowResult {
  status: WorkflowStatus;
  message: string;
  metadata?: Record<string, unknown>;
}

export interface WorkflowHandler {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handle: (event: EnterpriseEvent<any>) => Promise<WorkflowResult> | WorkflowResult;
}
