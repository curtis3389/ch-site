import {h, JSX, Fragment} from 'preact';
import {CollapsibleSection} from './CollapsibleSection';
import { PasswordGeneratorConfigInputProps } from './PasswordGeneratorConfigInputProps';
import { AlphabetInput } from './AlphabetInput';

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
  const onInputPadBefore: JSX.InputEventHandler<HTMLInputElement> = (e) => setConfig({
    ...config,
    paddingBefore: Number(e.currentTarget.value),
  });
  const onInputPadAfter: JSX.InputEventHandler<HTMLInputElement> = (e) => setConfig({
    ...config,
    paddingAfter: Number(e.currentTarget.value),
  });
  const onChangeType: JSX.GenericEventHandler<HTMLSelectElement> = (e) => setConfig({
    ...config,
    paddingType: e.currentTarget.value,
  });
  const onChangeCharType: JSX.GenericEventHandler<HTMLSelectElement> = (e) => setConfig({
    ...config,
    paddingCharacterType: e.currentTarget.value,
  });
  const onInputChar: JSX.InputEventHandler<HTMLInputElement> = (e) => setConfig({
    ...config,
    paddingCharacter: e.currentTarget.value,
  });
  const setAlphabet = (alphabet: string[]) => setConfig({
    ...config,
    paddingAlphabet: alphabet,
  });
  const onInputPadLength: JSX.InputEventHandler<HTMLInputElement> = (e) => setConfig({
    ...config,
    padToLength: Number(e.currentTarget.value),
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
      <label>
        Padding Type:
        <select value={config.paddingType} onChange={onChangeType}>
          <option value="none">none</option>
          <option value="fixed">Fixed</option>
          <option value="adaptive">Adaptive</option>
        </select>
    </label>
    {
      config.paddingType === 'fixed'
        ? (
          <Fragment>
            <label>
              Symbol(s) Before:
              <input type="number" value={config.paddingBefore} onInput={onInputPadBefore} />
            </label>
            <label>
              Symbol(s) After:
              <input type="number" value={config.paddingAfter} onInput={onInputPadAfter} />
            </label>
          </Fragment>
        )
        : config.paddingType === 'adaptive'
        ? (
          <label>
            Pad to Length:
            <input type="number" value={config.padToLength} onInput={onInputPadLength} />
            </label>
        )
        :null
    }
      {
        config.paddingType !== 'none'
          ? (
            <Fragment>
              <label>
                Padding Character:
                <select value={config.paddingCharacterType} onChange={onChangeCharType}>
                  <option value="single">Specified Character</option>
                  <option value="random">Random Character</option>
                </select>
              </label>
              {
                config.paddingCharacterType === 'single'
                  ? (
                    <label>
                      Character:
                      <input type="text" value={config.paddingCharacter} onInput={onInputChar} />
                      </label>
                  )
                  : config.paddingCharacterType === 'random'
                  ? (
                    <label>
                      Padding Alphabet:
                      <AlphabetInput alphabet={config.paddingAlphabet} setAlphabet={setAlphabet} />
                      </label>
                  )
                  : null
              }
            </Fragment>
          )
          : null
      }
    </CollapsibleSection>
  );
}
