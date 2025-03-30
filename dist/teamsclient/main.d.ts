import { ConnectorMessage } from './types.js';
declare function sendNotification(webHookUrl: string, message: ConnectorMessage, dryrun?: boolean, log?: (logMessage: string) => void, errorLog?: (logMessage: string) => void): Promise<void>;
export { sendNotification };
