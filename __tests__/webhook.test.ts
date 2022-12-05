import {buildConnectorMessage} from '../src/service/webhook'
import {expect, test} from '@jest/globals'
import {
  createCancelledNeed,
  createFailedNeed,
  createFailureJob,
  createSuccessNeed
} from '../src/testutil/util'

describe('Test webhook creation', function () {
  test('expect defaults to be set', async () => {
    const connectorMessage = buildConnectorMessage(
      {needs: [], webhookUrl: 'url'},
      'title'
    )

    console.log(JSON.stringify(connectorMessage))

    expect(connectorMessage['@context']).toBeTruthy()
    expect(connectorMessage['@type']).toBeTruthy()
  })

  test('expect color to be set green when no jobs or needs', async () => {
    const connectorMessage = buildConnectorMessage(
      {needs: [], webhookUrl: 'url'},
      'title'
    )

    console.log(JSON.stringify(connectorMessage))

    expect(connectorMessage.themeColor).toEqual('#2cbe4e')
  })

  test('expect color to be set red when any jobs or need fails', async () => {
    const connectorMessage = buildConnectorMessage(
      {
        needs: [createFailedNeed()],
        webhookUrl: 'url'
      },
      'title'
    )

    console.log(JSON.stringify(connectorMessage))

    expect(connectorMessage.themeColor).toEqual('#b80707')
  })
  test('expect color to be set red when any need fails', async () => {
    const connectorMessage = buildConnectorMessage(
      {
        needs: [createFailedNeed()],
        webhookUrl: 'url'
      },
      'title'
    )

    console.log(JSON.stringify(connectorMessage))

    expect(connectorMessage.themeColor).toEqual('#b80707')
  })
  test('expect color to be set grey when any jobs or need was cancelled', async () => {
    const connectorMessage = buildConnectorMessage(
      {
        needs: [createCancelledNeed()],
        webhookUrl: 'url'
      },
      'title'
    )

    console.log(JSON.stringify(connectorMessage))

    expect(connectorMessage.themeColor).toEqual('#7a7c7a')
  })

  test('expect color to be set red when any jobs fails', async () => {
    const connectorMessage = buildConnectorMessage(
      {
        needs: [createSuccessNeed()],
        webhookUrl: 'url',
        job: createFailureJob()
      },
      'title'
    )

    console.log(JSON.stringify(connectorMessage))

    expect(connectorMessage.themeColor).toEqual('#b80707')
  })
})
