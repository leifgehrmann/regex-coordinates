/**
 * A rough approximation of the return types
 */

export interface Token {
  type: string;
  offset: number;
  text: string;
}

interface Literal extends Token {
  type: 'literal';
  body: string;
  escaped: boolean;
}

interface Range extends Token {
  type: 'range';
  start: Literal;
  end: Literal;
}

interface MetaSequence extends Token {
  type: string;
  offset: number;
  text: string;
}

interface Anchors extends Token {
  type: 'non-word-boundary'|'word-boundary'|'start'|'end';
}

interface ControlCharacter extends Token {
  type: 'control-character';
  code: string;
}

interface Hex extends Token {
  type: 'hex';
  code: string;
}

interface Unicode extends Token {
  type: 'unicode';
  code: string;
}

interface BackReference extends Token {
  type: 'back-reference';
  code: string;
}

interface Quantifier extends Token {
  type: 'quantifier';
  min: number;
  max: number;
  greedy: boolean;
}

export interface Quantified extends Token {
  type: 'quantified';
  // eslint-disable-next-line no-use-before-define
  body: CaptureGroup|
    Literal|
    MetaSequence|
    BackReference|
    // eslint-disable-next-line no-use-before-define
    Charset|
    Unicode|
    // eslint-disable-next-line no-use-before-define
    PositiveLookahead|
    // eslint-disable-next-line no-use-before-define
    NegativeLookahead|
    // eslint-disable-next-line no-use-before-define
    NonCaptureGroup|
    ControlCharacter;
  quantifier: Quantifier;
}

export interface Match extends Token {
  type: 'match';
  body: (
    Quantified|
    Anchors|
    // eslint-disable-next-line no-use-before-define
    CaptureGroup|
    Literal|
    MetaSequence|
    BackReference|
    // eslint-disable-next-line no-use-before-define
    Charset|
    Unicode|
    // eslint-disable-next-line no-use-before-define
    PositiveLookahead|
    // eslint-disable-next-line no-use-before-define
    NegativeLookahead|
    // eslint-disable-next-line no-use-before-define
    NonCaptureGroup|
    ControlCharacter
    )[];
}

export interface Alternate extends Token {
  type: 'alternate';
  left: Match;
  right: Match|Alternate;
}

export interface NonCaptureGroup extends Token {
  type: 'capture-group';
  body: Match;
}

export interface CaptureGroup extends Token {
  type: 'capture-group';
  body: Match;
  index: number;
}

export interface PositiveLookahead extends Token {
  type: 'positive-lookahead';
  body: Match;
}

export interface NegativeLookahead extends Token {
  type: 'negative-lookahead';
  body: Match;
}

export interface Charset extends Token {
  type: 'charset';
  invert: boolean;
  body: (Literal|Range|Hex|Unicode|ControlCharacter)[];
}

export default function regexp(regex: string): Match|Alternate;
