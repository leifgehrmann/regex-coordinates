import MatchGroup from './matchGroup';

export default class MatchGroupTransformer {
  private limit = 5;

  transform(allMatches: string[][]): MatchGroup[] {
    const matchGroups: MatchGroup[] = [];
    allMatches.slice(0, this.limit).forEach((matches, matchesIndex) => {
      matches.forEach((match, groupNumber) => {
        if (matchesIndex === 0) {
          matchGroups.push({
            groupNumber,
            matchedValues: [],
          });
        }
        matchGroups[groupNumber].matchedValues.push(match);
      });
    });

    return matchGroups;
  }
}
