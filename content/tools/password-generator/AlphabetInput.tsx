import {h} from 'preact';

type AlphabetInputProps = {
  alphabet: string[];
  setAlphabet: (alphabet: string[]) => void;
};

export function AlphabetInput(props: AlphabetInputProps) {
  const {alphabet, setAlphabet} = props;
  const items = alphabet.map(c => (<li>{c}</li>));
  return (<ul>
    { items }
    </ul>);
}
