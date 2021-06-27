import Parser from '@/utils/parser';

function expectRegExpMatchArray(
  actual: RegExpMatchArray[],
  expected: {index: number; matches: string[]}[],
) {
  expect(actual.length).toEqual(expected.length);
  for (let i = 0; i < actual.length; i += 1) {
    expect(actual[i].index).toEqual(expected[i].index);
    expect(Array.from(actual[i])).toEqual(expected[i].matches);
  }
}

describe('Parser', () => {
  it('returns empty array if no regex is set', () => {
    const parser = new Parser();
    const data = 'hello world';
    const parseOutput = parser.parse(data);
    const parseWithFiniteMatchesOutput = parser.parseFiniteMatches(data, 10);
    expect(parseOutput).toEqual([]);
    expect(parseWithFiniteMatchesOutput).toEqual([]);
  });

  it('returns empty array if invalid regex is set', () => {
    const parser = new Parser();
    parser.setRegexFromString('\\', '');
    const data = 'hello world';
    const parseOutput = parser.parse(data);
    const parseWithFiniteMatchesOutput = parser.parseFiniteMatches(data, 10);
    expect(parseOutput).toEqual([]);
    expect(parseWithFiniteMatchesOutput).toEqual([]);
  });

  test.each([
    [
      'football vs foosball',
      '(foo[^\\s]+)',
      'g',
      [
        { index: 0, matches: ['football', 'football'] },
        { index: 12, matches: ['foosball', 'foosball'] },
      ],
    ],
    [
      'football vs foosball',
      '(foo[^\\s]+)',
      '',
      [
        { index: 0, matches: ['football', 'football'] },
      ],
    ],
    [
      'football vs foosball',
      '(bar)',
      '',
      [],
    ],
  ])('parse("%s")', (data, regexString, regexFlags, expectedOutput) => {
    const parser = new Parser();
    parser.setRegexFromString(regexString, regexFlags);
    const parseOutput = parser.parse(data);
    const parseWithFiniteMatchesOutput = parser.parseFiniteMatches(data, 10);
    expectRegExpMatchArray(parseOutput, expectedOutput);
    expectRegExpMatchArray(parseWithFiniteMatchesOutput, expectedOutput);
  });

  it('returns empty array if finite matches is 0', () => {
    const parser = new Parser();
    parser.setRegexFromString('(hello world)', '');
    const data = 'hello world';
    const parseWithFiniteMatchesOutput = parser.parseFiniteMatches(data, 0);
    expect(parseWithFiniteMatchesOutput).toEqual([]);
  });

  it('returns empty array if finite matches is 0', () => {
    const parser = new Parser();
    parser.setRegexFromString('([a-z])([a-z])', 'g');
    const data = 'hello universe';
    const parseWithFiniteMatchesOutput = parser.parseFiniteMatches(data, 4);
    expectRegExpMatchArray(parseWithFiniteMatchesOutput, [
      { index: 0, matches: ['he', 'h', 'e'] },
      { index: 2, matches: ['ll', 'l', 'l'] },
      { index: 6, matches: ['un', 'u', 'n'] },
      { index: 8, matches: ['iv', 'i', 'v'] },
    ]);
  });
});
