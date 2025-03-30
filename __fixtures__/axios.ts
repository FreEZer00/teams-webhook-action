import type axios from 'axios'
import { jest } from '@jest/globals'

const postMock = jest.fn<typeof axios.post>()

export default {
  post: postMock
}
