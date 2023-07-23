import Entry from './entry';

export default class Utils {
  /**
   * Takes the path to a csv file as input and return its representation as array of Entries
   * @param path string of the path to the csv file
   * @return array of the entries
   */
  static parseCsvToEntryData(path: string): Entry[] {
    const fs = require('fs');

    //reading the csv file
    const file = fs.readFileSync(path, 'utf-8');

    //splitting the file into lines
    const lines = file.split('\n');

    //split each line into values
    const values = lines.map((lines: any) => lines.split(','));

    //removing the first header line
    values.shift();

    //create an Entry for each line
    //remove \r from the balance
    const entries: Entry[] = values.map((entry: any) => {
      if (isNaN(entry[1])) {
        throw new Error('Balance must be a number');
      }

      return new Entry(this.parseUsername(entry[0]), BigInt(entry[1]));
    });

    return entries;
  }
  /**
   * Transform a username into its utf8 bytes representation, convert it to BigInt and return it
   * @param username the string of the username to be converted
   * @return BigInt representation of the username
   */
  static parseUsername(username: string): bigint {
    const encoder = new TextEncoder();
    const utf8bytes = encoder.encode(username);

    const bigIntNumber = BigInt('0x' + utf8bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''));
    return bigIntNumber;
  }
  /**
   * Transform a BigInt into its utf8 bytes representation, convert it to a username and return it.
   * @param bigIntUsername the bigInt to be converted
   * @return string representation of the username
   */
  static stringifyUsername(bigIntUsername: bigint): string {
    const hexString = bigIntUsername.toString(16);
    const hexArray = hexString.match(/.{2}/g) || [];
    const byteArray = hexArray.map((byte) => parseInt(byte, 16));

    const decoder = new TextDecoder();
    return decoder.decode(Uint8Array.from(byteArray));
  }
}
