import {h} from 'preact';

export function PasswordList(props) {
  const {passwords} = props;
  const listItems = passwords === null
        ? []
        : passwords.map(password => h('li', null, [password]));

  return (
    <ul>
      {listItems}
    </ul>);
}
