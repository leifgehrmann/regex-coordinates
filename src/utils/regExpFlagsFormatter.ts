import RegExpFlagsConfig from '@/utils/regExpFlagsConfig';

export default function convertRegExpFlagsConfigToString(flags: RegExpFlagsConfig): string {
  let flagsString = '';
  flagsString += flags.global ? 'g' : '';
  flagsString += flags.multiline ? 'm' : '';
  flagsString += flags.insensitive ? 'i' : '';
  flagsString += flags.singleline ? 's' : '';
  flagsString += flags.unicode ? 'u' : '';
  flagsString += flags.sticky ? 'y' : '';
  return flagsString;
}
