export default class RegExpUnescape {
  static unescape(escapedRegex: string): string {
    return escapedRegex.replace(/(\\*)\\\//g, (group1: string): string => {
      if (group1.length % 2) {
        return group1;
      }
      return group1.slice(1);
    });
  }
}
