import { ConnectorMessage } from '../teamsclient/types.js';
import { ActionInputs, GithubValues } from '../types.js';
declare function buildConnectorMessage(inputs: ActionInputs, githubValues: GithubValues): ConnectorMessage;
export { buildConnectorMessage };
