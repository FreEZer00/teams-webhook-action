import {buildConnectorMessage} from '../src/service/webhook'
import {expect, test} from '@jest/globals'
import {
  createCancelledNeed,
  createFailedNeed,
  createFailureJob,
  createSuccessJob,
  createSuccessNeed
} from '../src/testutil/util'
import {GithubValues} from '../src/types'

const githubValues: GithubValues = {
  workflow: 'workflow',
  job: 'jobName',
  run_id: 123,
  actor: 'freezer00'
}
describe('Test webhook creation', function () {
  test('expect defaults to be set', () => {
    const connectorMessage = buildConnectorMessage(
      {
        needs: [],
        webhookUrl: 'url',
        dryRun: false,
        title: 'title',
        additionalButtons: []
      },
      githubValues
    )

    console.log(JSON.stringify(connectorMessage))

    expect(connectorMessage['@context']).toBeTruthy()
    expect(connectorMessage['@type']).toBeTruthy()
  })

  test('expect color to be set green when no jobs or needs', () => {
    const connectorMessage = buildConnectorMessage(
      {
        needs: [],
        webhookUrl: 'url',
        dryRun: false,
        title: 'title',
        additionalButtons: []
      },
      githubValues
    )

    console.log(JSON.stringify(connectorMessage))

    expect(connectorMessage.themeColor).toEqual('#2cbe4e')
  })

  test('expect color to be set red when any jobs or need fails', () => {
    const connectorMessage = buildConnectorMessage(
      {
        needs: [createFailedNeed()],
        webhookUrl: 'url',
        dryRun: false,
        job: createSuccessJob(),
        title: 'title',
        additionalButtons: []
      },
      githubValues
    )

    console.log(JSON.stringify(connectorMessage))

    expect(connectorMessage.themeColor).toEqual('#b80707')
  })
  test('expect color to be set red when any need fails', () => {
    const connectorMessage = buildConnectorMessage(
      {
        needs: [createFailedNeed()],
        webhookUrl: 'url',
        dryRun: false,
        title: 'title',
        additionalButtons: []
      },
      githubValues
    )

    console.log(JSON.stringify(connectorMessage))

    expect(connectorMessage.themeColor).toEqual('#b80707')
  })
  test('expect color to be set grey when any jobs or need was cancelled', () => {
    const connectorMessage = buildConnectorMessage(
      {
        needs: [createCancelledNeed()],
        webhookUrl: 'url',
        dryRun: false,
        title: 'title',
        additionalButtons: []
      },
      githubValues
    )

    console.log(JSON.stringify(connectorMessage))

    expect(connectorMessage.themeColor).toEqual('#7a7c7a')
  })

  test('expect color to be set red when any jobs fails', () => {
    const connectorMessage = buildConnectorMessage(
      {
        needs: [createSuccessNeed()],
        webhookUrl: 'url',
        dryRun: false,
        job: createFailureJob(),
        title: 'title',
        additionalButtons: []
      },
      githubValues
    )

    console.log(JSON.stringify(connectorMessage))

    expect(connectorMessage.themeColor).toEqual('#b80707')
  })

  test('Test summary is set even though no input', () => {
    const connectorMessage = buildConnectorMessage(
      {
        needs: [createSuccessNeed()],
        dryRun: false,
        webhookUrl: 'url',
        job: createFailureJob(),
        additionalButtons: []
      },
      githubValues
    )
    console.log(JSON.stringify(connectorMessage))
    expect(connectorMessage.summary).toBeTruthy()
  })

  test('Test additionalButtons', () => {
    const connectorMessage = buildConnectorMessage(
      {
        needs: [createSuccessNeed()],
        dryRun: false,
        webhookUrl: 'url',
        job: createFailureJob(),
        additionalButtons: [{url: 'url', displayName: 'name'}]
      },
      githubValues
    )
    console.log(JSON.stringify(connectorMessage))
    expect(connectorMessage.potentialAction).not.toBeUndefined()
    expect(connectorMessage.potentialAction?.length).toEqual(1)
  })
})
