interface Fact {
  name: string
  values: string
}

interface Section {
  activityTitle: string
  activitySubtitle: string
  activityImage: string
  facts: Fact[]
  markdown: boolean
}

type Input = TextInput | DateInput | MultichoiceInput

interface Choice {
  display: string
  value: number
}

interface MultichoiceInput {
  '@type': 'MultichoiceInput'
  id: 'list'
  title: string
  isMultiSelect: boolean
  choices: Choice[]
}
interface DateInput {
  '@type': 'DateInput'
  id: string
  title: string
}
interface TextInput {
  '@type': 'TextInput'
  id: string
  isMultiLine: boolean
  title: string
}

interface Target {
  os: 'default'
  uri: string
}

type PotentialAction = ActionCardAction | OpenUriAction

interface OpenUriAction {
  '@type': 'OpenUri'
  name: string
  targets: Target[]
}
const defaultOpenUriAction = {
  '@type': 'OpenUri',
  name: null,
  targets: []
}

interface Action {
  '@type': string //'HttpPOST'
  name: string
  target: string
}

const defaultAction = {
  '@type': 'HttpPOST',
  name: null,
  target: null
}

interface ActionCardAction {
  '@type': string //'ActionCard'
  name: string
  inputs: Input[]
  actions: Action[]
  targets: Target[]
}

const defaultActionCardAction = {
  '@type': 'ActionCard',
  name: null,
  inputs: [],
  actions: [],
  targets: []
}

interface ConnectorMessage {
  '@type'?: string
  '@context'?: string
  themeColor: string
  summary: string
  sections?: Section[]
  potentialAction?: PotentialAction[]
}

const defaultConnectorMessage = {
  '@type': 'MessageCard',
  '@context': 'http://schema.org/extensions',
  themeColor: null,
  summary: null,
  sections: [],
  potentialAction: []
}

export {
  defaultConnectorMessage,
  defaultOpenUriAction,
  defaultAction,
  defaultActionCardAction,
  Action,
  PotentialAction,
  OpenUriAction,
  ActionCardAction,
  MultichoiceInput,
  Choice,
  Target,
  Input,
  DateInput,
  TextInput,
  Fact,
  Section,
  ConnectorMessage
}
