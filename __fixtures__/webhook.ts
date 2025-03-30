import { jest } from '@jest/globals'

export const buildConnectorMessage =
  jest.fn<typeof import('../src/service/webhook.js').buildConnectorMessage>()
