export default class Parser {
  private regex: RegExp | null;

  constructor() {
    this.regex = null;
  }

  public setRegexFromString(regexString: string) {
    try {
      this.regex = new RegExp(regexString, 'gm');
    } catch {
      this.regex = null;
    }
  }

  public parse(data: string): string[][] {
    const allMatches:string[][] = [];
    if (this.regex === null) {
      return allMatches;
    }

    let matches;
    // eslint-disable-next-line no-cond-assign
    while ((matches = this.regex.exec(data)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (matches.index === this.regex.lastIndex) {
        this.regex.lastIndex += 1;
      }

      allMatches.push(matches);
    }

    return allMatches;
  }
}
