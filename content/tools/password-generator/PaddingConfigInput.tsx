import {h, JSX} from 'preact';
import {CollapsibleSection} from './CollapsibleSection';
import { PasswordGeneratorConfigInputProps } from './PasswordGeneratorConfigInputProps';

export function PaddingConfigInput(props: PasswordGeneratorConfigInputProps) {
  const {config, setConfig} = props;
  const onInputBefore: JSX.InputEventHandler<HTMLInputElement> = (e) => setConfig({
    ...config,
    digitsBefore: Number(e.currentTarget.value),
  });
  const onInputAfter: JSX.InputEventHandler<HTMLInputElement> = (e) => setConfig({
    ...config,
    digitsAfter: Number(e.currentTarget.value),
  });

  return (
    <CollapsibleSection title="Padding Options" level={4}>
      <label>
        Digit(s) Before:
      <input type="number" value={config.digitsBefore} onInput={onInputBefore} />
      </label>
      <label>
        Digit(s) After:
        <input type="number" value={config.digitsAfter} onInput={onInputAfter} />
      </label>
    </CollapsibleSection>
  );
}
