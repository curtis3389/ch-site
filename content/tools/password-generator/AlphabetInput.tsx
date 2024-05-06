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
    <li>
      {c}
      <button onClick={() => deleteChar(c)}>🗑️</button>
    </li>));
  return (
    <ul>
      { items }
      <div>
        <input type="text" value={newChar} onInput={onInputChar} />
        <button onClick={onAdd}>Add</button>
      </div>
    </ul>);
}
