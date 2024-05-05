import {h, JSX} from 'preact';
import {CollapsibleSection} from './CollapsibleSection';
import { PasswordGeneratorConfigInputProps } from './PasswordGeneratorConfigInputProps';

export function TransformConfigInput(props: PasswordGeneratorConfigInputProps) {
  const {config, setConfig} = props;
  const onChangeTransform: JSX.GenericEventHandler<HTMLSelectElement> = (e) => setConfig({
    ...config,
    wordTransform: e.currentTarget.value,
  });

  return (
    <CollapsibleSection title="Word Transformation Options" level={4}>
      <label>
        Case Transformation:
      <select value={config.wordTransform} onChange={onChangeTransform}>
          <option value="none">none</option>
          <option value="alternating">alternating WORD case</option>
          <option value="capitalize">Capitalize First Letter</option>
          <option value="rcapitalize">cAPITALIZE eVERY lETTER eXCEPT tHE fIRST</option>
          <option value="lower">lower case</option>
          <option value="upper">UPPER CASE</option>
          <option value="random">RANDOM word case</option>
        </select>
      </label>
    </CollapsibleSection>
  );
}
