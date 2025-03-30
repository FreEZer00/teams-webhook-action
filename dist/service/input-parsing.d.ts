import { JobStatus, NeedsResult } from '../types.js';
declare function parseNeeds(needs: string): NeedsResult[];
declare function parseJob(job: string): JobStatus | undefined;
export { parseJob, parseNeeds };
