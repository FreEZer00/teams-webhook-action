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

interface Action {
  '@type': 'HttpPOST'
  name: string
  target: string
}

interface ActionCardAction {
  '@type': 'ActionCard'
  name: string
  inputs: Input[]
  actions: Action[]
  targets: Target[]
}

interface ConnectorMessage {
  '@type': 'MessageCard'
  '@context': 'http://schema.org/extensions'
  themeColor: string
  summary: string
  sections?: Section[]

  potentialAction?: PotentialAction[]
}

export {
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
