import {buildConnectorMessage} from '../src/service/webhook'
import {expect, test} from '@jest/globals'

test('throws invalid number', async () => {
  const connectorMessage = buildConnectorMessage(
    {needs: [], webhookUrl: 'url'},
    'title'
  )

  console.log(JSON.stringify(connectorMessage))
})
