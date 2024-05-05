import {h, JSX} from 'preact';
import {CollapsibleSection} from './CollapsibleSection';
import { PasswordGeneratorConfigInputProps } from './PasswordGeneratorConfigInputProps';

export function DictionaryConfigInput(props: PasswordGeneratorConfigInputProps) {
  const {config, setConfig} = props;
  const onNumInput: JSX.InputEventHandler<HTMLInputElement> = (e) => setConfig({
    ...config,
    numberOfWords: Number(e.currentTarget.value),
  });
  const onMinInput: JSX.InputEventHandler<HTMLInputElement> = (e) => setConfig({
    ...config,
    minimumWordLength: Number(e.currentTarget.value),
  });
  const onMaxInput: JSX.InputEventHandler<HTMLInputElement> = (e) => setConfig({
    ...config,
    maximumWordLength: Number(e.currentTarget.value),
  });
  const onEnableMinInput: JSX.InputEventHandler<HTMLInputElement> = (e) => setConfig({
    ...config,
    enableMinimumWordLength: e.currentTarget.checked,
  });
  const onEnableMaxInput: JSX.InputEventHandler<HTMLInputElement> = (e) => setConfig({
    ...config,
    enableMaximumWordLength: e.currentTarget.checked,
  });

  return (
    <CollapsibleSection title="Dictionary Options" level={4}>
      <label>
        Number of words:
        <input type="number" value={config.numberOfWords} onInput={onNumInput} />
      </label>
      <label>
        <input type="checkbox" checked={config.enableMinimumWordLength} onInput={onEnableMinInput} />
        Minimum word length:
        <input type="number" value={config.minimumWordLength} onInput={onMinInput} />
      </label>
      <label>
        <input type="checkbox" checked={config.enableMaximumWordLength} onInput={onEnableMaxInput} />
        Maximim word length:
        <input type="number" value={config.maximumWordLength} onInput={onMaxInput} />
      </label>
    </CollapsibleSection>
  );
}
