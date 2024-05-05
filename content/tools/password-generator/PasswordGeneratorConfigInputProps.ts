import { StateUpdater } from 'preact/hooks';
import { PasswordGeneratorConfig } from './PasswordGeneratorConfig';

export type PasswordGeneratorConfigInputProps = {
  config: PasswordGeneratorConfig;
  setConfig: StateUpdater<PasswordGeneratorConfig>;
};
