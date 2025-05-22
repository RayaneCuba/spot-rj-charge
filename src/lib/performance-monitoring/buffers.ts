
import { PerformanceEvent, ErrorEvent } from './types';

// Buffers to store events before sending
export const performanceBuffer: PerformanceEvent[] = [];
export const errorBuffer: ErrorEvent[] = [];
