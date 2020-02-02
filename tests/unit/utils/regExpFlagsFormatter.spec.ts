import regExpFlagsFormatter from '@/utils/regExpFlagsFormatter';

describe('regExpFlagsFormatter', () => {
  test.each([
    [{
      global: true,
      multiline: true,
      insensitive: true,
      singleline: true,
      unicode: true,
      sticky: true,
    }, 'gmisuy'],
    [{}, ''],
  ])('regExpUnescape(%s)', (flags, expectedOutput) => {
    const output = regExpFlagsFormatter(flags);
    expect(output).toEqual(expectedOutput);
  });
});
