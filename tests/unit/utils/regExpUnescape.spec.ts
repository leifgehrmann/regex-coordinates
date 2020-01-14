import RegExpUnescape from '@/utils/regExpUnescape';

describe('regExpUnescape', () => {
  test.each([
    ['', ''],
    ['abc', 'abc'],
    ['abc/efg', 'abc/efg'],
    ['abc/\\efg', 'abc/\\efg'],
    ['abc\\/efg', 'abc/efg'],
    ['abc\\\\/efg', 'abc\\\\/efg'],
    ['abc[/]efg', 'abc[/]efg'],
    ['abc[/\\]efg', 'abc[/\\]efg'],
    ['abc[\\/]efg', 'abc[/]efg'],
    ['abc[\\\\/]efg', 'abc[\\\\/]efg'],
    ['abc[\\\\\\/]efg', 'abc[\\\\/]efg'],
    ['abc[\\\\\\\\/]efg', 'abc[\\\\\\\\/]efg'],
    ['abc[\\\\\\\\\\/]efg', 'abc[\\\\\\\\/]efg'],
  ])('regExpUnescape(%s)', (escapedRegexString, expectedOutput) => {
    const output = RegExpUnescape.unescape(escapedRegexString);
    expect(output).toEqual(expectedOutput);
  });
});
