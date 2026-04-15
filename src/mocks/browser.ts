import { setupWorker } from 'msw/browser';
import { agreementHandlers } from './handlers/agreement';
import { authHandlers } from './handlers/auth';
import { contractHandlers } from './handlers/contract';

export const worker = setupWorker(...agreementHandlers, ...authHandlers, ...contractHandlers);
