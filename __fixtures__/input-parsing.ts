import { jest } from '@jest/globals'

export const parseJob =
  jest.fn<typeof import('../src/service/input-parsing.js').parseJob>()
export const parseNeeds =
  jest.fn<typeof import('../src/service/input-parsing.js').parseNeeds>()
