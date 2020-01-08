export default class Parser {
  private regex: RegExp | null;

  constructor() {
    this.regex = null;
  }

  public setRegexFromString(regexString: string): void {
    try {
      this.regex = new RegExp(regexString, 'gm');
    } catch {
      this.regex = null;
    }
  }

  public parse(data: string): string[][] {
    const allMatches: string[][] = [];
    if (this.regex === null) {
      return allMatches;
    }

    return Array.from(data.matchAll(this.regex));
  }

  // @todo: Do not leave like this
  public parse2(data: string): RegExpMatchArray[] {
    const allMatches: string[][] = [];
    if (this.regex === null) {
      return allMatches;
    }

    return Array.from(data.matchAll(this.regex));
  }
}
