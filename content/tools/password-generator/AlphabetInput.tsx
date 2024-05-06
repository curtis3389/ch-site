import {h} from 'preact';
import {useState} from 'preact/hooks';

type AlphabetInputProps = {
  alphabet: string[];
  setAlphabet: (alphabet: string[]) => void;
};

export function AlphabetInput(props: AlphabetInputProps) {
  const {alphabet, setAlphabet} = props;
  const [newChar, setNewChar] = useState('');
  const onInputChar = (e) => setNewChar(e.currentTarget.value);
  const onAdd = () => setAlphabet([
    ...alphabet,
    newChar,
  ]);
  const deleteChar = (c) => setAlphabet(alphabet.filter(a => a !== c));

  const items = alphabet.map(c => (
    <li class="alphabet-input__item">
      <div class="alphabet-input__text">{c}</div>
      <a class="alphabet-input__delete" onClick={() => deleteChar(c)}>🗑️</a>
    </li>));
  return (
    <ul class="alphabet-input">
      { items }
      <div>
        <input type="text" value={newChar} onInput={onInputChar} />
        <button onClick={onAdd}>Add</button>
      </div>
    </ul>);
}
