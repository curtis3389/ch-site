export interface PasswordGeneratorConfig {
  digitsAfter: number;
  digitsBefore: number;
  enableMaximumWordLength: boolean;
  enableMinimumWordLength: boolean;
  maximumWordLength: number;
  minimumWordLength: number;
  numberOfPasswords: number;
  numberOfWords: number;
  separatorAlphabet: string[];
  separatorCharacter: string;
  separatorType: string;
  wordTransform: string; // TODO: use enum
}
