interface Fact {
    name: string;
    value: string;
}
interface Section {
    activityTitle: string;
    activitySubtitle?: string;
    activityImage?: string;
    facts: Fact[];
    markdown: boolean;
}
type Input = TextInput | DateInput | MultichoiceInput;
interface Choice {
    display: string;
    value: number;
}
interface MultichoiceInput {
    '@type': 'MultichoiceInput';
    id: 'list';
    title: string;
    isMultiSelect: boolean;
    choices: Choice[];
}
interface DateInput {
    '@type': 'DateInput';
    id: string;
    title: string;
}
interface TextInput {
    '@type': 'TextInput';
    id: string;
    isMultiLine: boolean;
    title: string;
}
interface Target {
    os: string;
    uri: string;
}
declare const defaultTarget: {
    os: string;
    uri: null;
};
type PotentialAction = ActionCardAction | OpenUriAction;
interface OpenUriAction {
    '@type': string;
    name: string;
    targets: Target[];
}
declare const defaultOpenUriAction: {
    '@type': string;
    name: null;
    targets: never[];
};
interface Action {
    '@type': string;
    name: string;
    target: string;
}
declare const defaultAction: {
    '@type': string;
    name: null;
    target: null;
};
interface ActionCardAction {
    '@type': string;
    name: string;
    inputs: Input[];
    actions: Action[];
    targets: Target[];
}
declare const defaultActionCardAction: {
    '@type': string;
    name: null;
    inputs: never[];
    actions: never[];
    targets: never[];
};
interface ConnectorMessage {
    '@type'?: string;
    '@context'?: string;
    themeColor: string;
    summary: string;
    sections?: Section[];
    potentialAction?: PotentialAction[];
}
declare const defaultConnectorMessage: {
    '@type': string;
    '@context': string;
    themeColor: null;
    summary: null;
    sections: never[];
    potentialAction: never[];
};
export { defaultConnectorMessage, defaultOpenUriAction, defaultAction, defaultActionCardAction, defaultTarget, Action, PotentialAction, OpenUriAction, ActionCardAction, MultichoiceInput, Choice, Target, Input, DateInput, TextInput, Fact, Section, ConnectorMessage };
