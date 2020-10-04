import RegExpUnescape from '@/utils/regExpUnescape';

export default class Parser {
  private regex: RegExp | null;

  constructor() {
    this.regex = null;
  }

  public setRegexFromString(
    regexString: string,
    regexFlags: string,
  ): void {
    try {
      this.regex = new RegExp(RegExpUnescape.unescape(regexString), regexFlags);
    } catch {
      this.regex = null;
    }
  }

  public parse(data: string): RegExpMatchArray[] {
    const allMatches: string[][] = [];
    if (this.regex === null) {
      return allMatches;
    }

    if (this.regex.global) {
      return Array.from(data.matchAll(this.regex));
    }
    const singleMatch = data.match(this.regex);
    if (singleMatch) {
      return [singleMatch];
    }
    return [];
  }
}
