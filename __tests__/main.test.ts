/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'
import * as webhook from '../src/service/webhook'
import * as teamsclient from '../src/teamsclient/main'
import * as parsing from '../src/service/input-parsing'
import { ConnectorMessage } from '../src/teamsclient/types'

const mockConnectorMessage: ConnectorMessage = {
  '@type': 'MessageCard',
  '@context': 'http://schema.org/extensions',
  themeColor: '#b80707',
  summary: 'title',
  sections: [
    {
      activityTitle: 'undefined >> title',
      activitySubtitle: 'Triggered by freezer00',
      facts: [],
      markdown: false
    }
  ],
  potentialAction: []
}
const mockWebhookUrl = 'mockurl'
// Mock the action's main function
const runMock = jest.spyOn(main, 'run')
const webhookMock = jest
  .spyOn(webhook, 'buildConnectorMessage')
  .mockImplementation(() => mockConnectorMessage)
const teamsclientMock = jest
  .spyOn(teamsclient, 'sendNotification')
  .mockImplementation()
const parseJobMock = jest
  .spyOn(parsing, 'parseJob')
  .mockImplementation(() => undefined)
const parseNeedsMock = jest
  .spyOn(parsing, 'parseNeeds')
  .mockImplementation(() => [])

// Mock the GitHub Actions core library
let infoMock: jest.SpyInstance
let errorMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let getBooleanInputMock: jest.SpyInstance
let getMultilineInputMock: jest.SpyInstance
let setFailedMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    infoMock = jest.spyOn(core, 'info').mockImplementation()
    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    getBooleanInputMock = jest
      .spyOn(core, 'getBooleanInput')
      .mockImplementation()
    getMultilineInputMock = jest
      .spyOn(core, 'getMultilineInput')
      .mockImplementation()
    setFailedMock = jest.spyOn(core, 'setFailed').mockImplementation()
  })

  it('calls send webhook', async () => {
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'webhook_url':
          return mockWebhookUrl
        default:
          return ''
      }
    })
    getBooleanInputMock.mockImplementation((name: string): boolean => {
      switch (name) {
        case 'dry_run':
          return true
        default:
          return true
      }
    })
    getMultilineInputMock.mockImplementation(() => [])
    await main.run()
    expect(runMock).toHaveReturned()

    expect(parseJobMock).toHaveBeenCalled()
    expect(parseNeedsMock).toHaveBeenCalled()
    expect(webhookMock).toHaveBeenCalled()
    expect(teamsclientMock).toHaveBeenCalledWith(
      mockWebhookUrl,
      mockConnectorMessage,
      true,
      infoMock,
      errorMock
    )
  })

  // it('sets the time output', async () => {
  //   // Set the action's inputs as return values from core.getInput()
  //   getInputMock.mockImplementation((name: string): string => {
  //     switch (name) {
  //       case 'milliseconds':
  //         return '500'
  //       default:
  //         return ''
  //     }
  //   })

  //   await main.run()
  //   expect(runMock).toHaveReturned()

  //   // Verify that all of the core library functions were called correctly
  //   expect(debugMock).toHaveBeenNthCalledWith(1, 'Waiting 500 milliseconds ...')
  //   expect(debugMock).toHaveBeenNthCalledWith(
  //     2,
  //     expect.stringMatching(timeRegex)
  //   )
  //   expect(debugMock).toHaveBeenNthCalledWith(
  //     3,
  //     expect.stringMatching(timeRegex)
  //   )
  //   expect(setOutputMock).toHaveBeenNthCalledWith(
  //     1,
  //     'time',
  //     expect.stringMatching(timeRegex)
  //   )
  //   expect(errorMock).not.toHaveBeenCalled()
  // })

  // it('sets a failed status', async () => {
  //   // Set the action's inputs as return values from core.getInput()
  //   getBooleanInputMock.mockImplementation((name: string): any => {
  //     switch (name) {
  //       case 'dry_run':
  //         return true
  //       default:
  //         return ''
  //     }
  //   })

  //   await main.run()
  //   expect(runMock).toHaveReturned()

  //   // Verify that all of the core library functions were called correctly
  //   expect(setFailedMock).toHaveBeenNthCalledWith(
  //     1,
  //     'milliseconds not a number'
  //   )
  //   expect(errorMock).not.toHaveBeenCalled()
})
