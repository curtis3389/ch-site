import {h} from 'preact';
import {useState} from 'preact/hooks';
import {PasswordGenerator} from './PasswordGenerator';
import {PasswordGeneratorConfig} from './PasswordGeneratorConfig';
import {PasswordGeneratorConfigInput} from './PasswordGeneratorConfigInput';
import {PasswordList} from './PasswordList';
import {PasswordGeneratorConfigSummary} from './PasswordGeneratorConfigSummary';

export function PasswordGeneratorInput() {
  const [config, setConfig] = useState<PasswordGeneratorConfig>({
    digitsAfter: 2,
    digitsBefore: 2,
    enableMaximumWordLength: false,
    enableMinimumWordLength: false,
    maximumWordLength: 8,
    minimumWordLength: 4,
    numberOfPasswords: 10,
    numberOfWords: 4,
    separatorAlphabet: ['*'],
    separatorCharacter: '-',
    separatorType: 'none',
    wordTransform: 'alternating',
  });
  const [passwords, setPasswords] = useState(null);
  const onClickGenerate = () =>
    setPasswords(new PasswordGenerator(config).generatePasswords());

  return (
    <div>
      <PasswordGeneratorConfigInput config={config} setConfig={setConfig} />
      <PasswordGeneratorConfigSummary config={config} />
      <button onClick={onClickGenerate}>Generate</button>
      <PasswordList passwords={passwords} />
    </div>);
}
