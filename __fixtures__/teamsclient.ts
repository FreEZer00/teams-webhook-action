import { jest } from '@jest/globals'

export const sendNotification =
  jest.fn<typeof import('../src/teamsclient/main.js').sendNotification>()
