import {h, JSX} from 'preact';
import {CollapsibleSection} from './CollapsibleSection';
import { PasswordGeneratorConfigInputProps } from './PasswordGeneratorConfigInputProps';
import {AlphabetInput} from './AlphabetInput';

export function SeparatorConfigInput(props: PasswordGeneratorConfigInputProps) {
  const {config, setConfig} = props;
  const onChangeType: JSX.GenericEventHandler<HTMLSelectElement> = (e) => setConfig({
    ...config,
    separatorType: e.currentTarget.value,
  });
  const onInputChar: JSX.InputEventHandler<HTMLInputElement> = (e) => setConfig({
    ...config,
    separatorCharacter: e.currentTarget.value,
  });
  const setAlphabet = (alphabet: string[]) => setConfig({
    ...config,
    separatorAlphabet: alphabet,
  });

  const typeInputs = config.separatorType === 'single'
    ? (
      <label>
        Character:
        <input type="text" value={config.separatorCharacter} onInput={onInputChar} />
      </label>
    )
    : config.separatorType === 'random'
    ? (
      <label>
        Separator Alphabet:
        <AlphabetInput alphabet={config.separatorAlphabet} setAlphabet={setAlphabet} />
      </label>
    )
    : null;
  return (
    <CollapsibleSection title="Separator Options" level={4}>
      <label>
        Separator Type:
        <select value={config.separatorType} onChange={onChangeType}>
          <option value="none">none</option>
          <option value="single">Specified Character</option>
          <option value="random">Random Character</option>
        </select>
      </label>
      { typeInputs }
    </CollapsibleSection>
  );
}
