export default class RegExpMatchArrayInverter {
  private limit = 10;

  transformMatchAll(matchAllResult: RegExpMatchArray[]): string[][] {
    const allGroupMatches: string[][] = [];
    matchAllResult.slice(0, this.limit).forEach((matches) => {
      matches.forEach((match, groupNumber) => {
        if (groupNumber === 0) {
          return;
        }
        if (allGroupMatches.length < groupNumber) {
          allGroupMatches.push([]);
        }
        allGroupMatches[groupNumber - 1].push(match);
      });
    });

    return allGroupMatches;
  }
}
