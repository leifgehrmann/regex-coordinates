export default interface RegExpFlatToken {
  indexStart: number;
  indexEnd: number;
  type: string;
  text: string;
  alternate?: { // @todo utilize this
    index: number; // Index of the "|"
  };
  literal?: { // @todo utilize this
    escaped: boolean; // Whether or not the literal was escaped
  };
}
