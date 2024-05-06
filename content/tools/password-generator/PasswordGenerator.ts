import english from './english.json';
import {PasswordGeneratorConfig} from './PasswordGeneratorConfig';

export class PasswordGenerator {
  readonly config: PasswordGeneratorConfig;
  private readonly dictionary: string[];

  constructor(config: PasswordGeneratorConfig) {
    this.config = config;
    let dictionary = english.words;
    if (this.config.enableMinimumWordLength) {
      dictionary = dictionary.filter(word => word.length >= this.config.minimumWordLength);
    }
    if (this.config.enableMaximumWordLength) {
      dictionary = dictionary.filter(word => word.length <= this.config.maximumWordLength);
    }
    this.dictionary = dictionary;
  }

  generatePasswords(): string[] {
    const passwords = [];
    for (let i = 0; i < this.config.numberOfPasswords; ++i) {
      passwords.push(this.generatePassword());
    }
    return passwords;
  }

  generatePassword(): string {
    const words = this.randomWords();
    const transformedWords = this.transformWords(words);
    let password = this.joinWords(transformedWords);
    password = this.padWithNumbers(password);
    return this.padWithSymbols(password);
  }

  transformWords(words: string[]): string[] {
    switch (this.config.wordTransform) {
      case 'none':
        return words;
      case 'alternating':
        return words.map((word, index) => index % 2 == 0 ? word.toLowerCase() : word.toUpperCase());
      case 'capitalize':
        return words.map(word => this.capitalize(word));
      case 'rcapitalize':
        return words.map(word => this.reverseCapitalize(word));
      case 'lower':
        return words.map(word => word.toLowerCase());
      case 'upper':
        return words.map(word => word.toUpperCase());
      case 'random':
        return words.map(word => this.randomInt(10) < 5 ? word.toLowerCase() : word.toUpperCase());
      default:
        throw new Error(`Unknown word transform: ${this.config.wordTransform}`);
    }
  }

  capitalize(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }

  reverseCapitalize(word: string): string {
    return word.charAt(0).toLowerCase() + word.slice(1).toUpperCase();
  }

  joinWords(words: string[]): string {
    const spacerSymbol =  this.config.separatorType === 'none'
      ? ''
      : this.config.separatorType === 'single'
      ? this.config.separatorCharacter
      : this.randomOf(this.config.separatorAlphabet);
    const middle = words.join(spacerSymbol);
    return words.length === 0
      ? spacerSymbol
      : `${spacerSymbol}${middle}${spacerSymbol}`;
  }

  padWithNumbers(s: string): string {
    const leftNumber = this.range(this.config.digitsBefore).map(() => this.randomDigit()).join('');
    const rightNumber = this.range(this.config.digitsAfter).map(() => this.randomDigit()).join('');
    return `${leftNumber}${s}${rightNumber}`;
  }

  range(n: number): number[] {
    let numbers = [];
    for (let i = 0; i < n; ++i) {
      numbers.push(i);
    }
    return numbers;
  }

  padWithSymbols(s: string): string {
    if (this.config.paddingType === 'none') {
      return s;
    }

    const paddingSymbol = this.config.paddingCharacterType === 'single'
      ? this.config.paddingCharacter
      : this.randomOf(this.config.paddingAlphabet);

    if (this.config.paddingType === 'adaptive') {
      if (s.length < this.config.padToLength) {
        const rightPad = this.range(this.config.padToLength - s.length).map(() => paddingSymbol).join('');
        return `${s}${rightPad}`;
      }

      return s;
    }

    const leftPad = this.range(this.config.paddingBefore).map(() => paddingSymbol).join('');
    const rightPad = this.range(this.config.paddingAfter).map(() => paddingSymbol).join('');

    return `${leftPad}${s}${rightPad}`;
  }

  randomDigit(): number {
    return this.randomInt(10);
  }

  randomWords(): string[] {
    const words = [];
    for (var i = 0; i < this.config.numberOfWords; ++i) {
      words.push(this.randomOf(this.dictionary));
    }
    return words;
  }

  randomOf<T>(list: T[]): T {
    const index = this.randomInt(list.length);
    return list[index];
  }

  randomInt(max: number): number {
    return Math.floor(this.randomFloat() * max)
  }

  randomFloat(): number {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / 0xffffffff;
  }
}
