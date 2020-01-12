import regexp, {
  Token,
  Alternate,
  Match,
  Quantified,
  NonCaptureGroup,
  CaptureGroup,
  PositiveLookahead,
  NegativeLookahead,
  Charset,
  Literal,
} from 'regexp';
import RegExpToken from '@/utils/regExpToken';

function createToken(token: Token): RegExpToken {
  let { type, text } = token;
  let indexStart = token.offset;
  let indexEnd = token.offset + token.text.length;
  if (token.type === 'alternate') {
    const alternate = (token as Alternate);
    text = '|';
    indexStart += alternate.left.text.length;
    indexEnd = indexStart + 1;
  }

  if (token.type === 'literal' && (token as Literal).escaped) {
    type += '-escaped';
  }

  return {
    type,
    text,
    indexStart,
    indexEnd,
  };
}

function flattenTokens(token: Token): RegExpToken[] {
  const regExpTokens = [];
  regExpTokens.push(createToken(token));
  if (token.type === 'alternate') {
    regExpTokens.push(...flattenTokens((token as Alternate).left));
    regExpTokens.push(...flattenTokens((token as Alternate).right));
  } else if (token.type === 'match') {
    (token as Match).body.forEach((bodyToken) => {
      regExpTokens.push(...flattenTokens(bodyToken));
    });
  } else if (token.type === 'charset') {
    (token as Charset).body.forEach((bodyToken) => {
      regExpTokens.push(...flattenTokens(bodyToken));
    });
  } else if (token.type === 'quantified') {
    regExpTokens.push(...flattenTokens((token as Quantified).body));
    regExpTokens.push(...flattenTokens((token as Quantified).quantifier));
  } else if (token.type !== 'literal' && ('body' in token)) {
    regExpTokens.push(...flattenTokens((token as Quantified|
      NonCaptureGroup|
      CaptureGroup|
      PositiveLookahead|
      NegativeLookahead
    ).body));
  }
  return regExpTokens;
}

export default function parseRegExp(regexString: string): RegExpToken[] {
  const nestedTokens = regexp(regexString);
  return flattenTokens(nestedTokens);
}
