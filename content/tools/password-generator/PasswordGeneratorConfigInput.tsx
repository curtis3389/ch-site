import {h} from 'preact';
import {DictionaryConfigInput} from './DictionaryConfigInput';
import {TransformConfigInput} from './TransformConfigInput';
import {SeparatorConfigInput} from './SeparatorConfigInput';
import {PaddingConfigInput} from './PaddingConfigInput';
import { PasswordGeneratorConfigInputProps } from './PasswordGeneratorConfigInputProps';
import {CollapsibleSection} from './CollapsibleSection';

export function PasswordGeneratorConfigInput(props: PasswordGeneratorConfigInputProps) {
  return (
    <CollapsibleSection title="Settings" level={3}>
      <DictionaryConfigInput {...props} />
      <TransformConfigInput {...props} />
      <SeparatorConfigInput {...props} />
      <PaddingConfigInput {...props} />
    </CollapsibleSection>
  );
}
