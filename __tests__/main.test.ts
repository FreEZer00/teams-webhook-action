/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { buildConnectorMessage } from '../__fixtures__/webhook.js'
import { sendNotification } from '../__fixtures__/teamsclient.js'
import { parseJob, parseNeeds } from '../__fixtures__/input-parsing.js'
import { ConnectorMessage } from '../src/teamsclient/types.js'

jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/service/webhook.js', () => ({
  buildConnectorMessage
}))
jest.unstable_mockModule('../src/service/input-parsing.js', () => ({
  parseJob,
  parseNeeds
}))
jest.unstable_mockModule('../src/teamsclient/main.js', () => ({
  sendNotification
}))

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

const { run } = await import('../src/main.js')
describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('calls send webhook', async () => {
    core.getInput.mockImplementation((name: string): string => {
      switch (name) {
        case 'webhook_url':
          return mockWebhookUrl
        default:
          return ''
      }
    })
    core.getBooleanInput.mockImplementation(() => true)
    core.getMultilineInput.mockImplementation(() => [])
    buildConnectorMessage.mockReturnValueOnce(mockConnectorMessage)

    await run()

    expect(parseJob).toHaveBeenCalled()
    expect(parseNeeds).toHaveBeenCalled()
    expect(buildConnectorMessage).toHaveBeenCalled()
    expect(sendNotification).toHaveBeenCalledWith(
      mockWebhookUrl,
      mockConnectorMessage,
      true,
      core.info,
      core.error
    )

    expect(core.setFailed).not.toHaveBeenCalled()
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
