import {h, Fragment, ComponentChildren, JSX} from 'preact';
import {useState} from 'preact/hooks';

export interface CollapsibleSectionProps {
  children: ComponentChildren;
  defaultHide?: boolean;
  level?: number;
  title: string;
}

export function CollapsibleSection(props: CollapsibleSectionProps) {
  const {children, defaultHide, level, title} = props;
  const [hide, setHide] = useState(defaultHide ?? true);
  const onClick = () => setHide(!hide);

  const getHeading = (text: string, level?: number): JSX.Element => {
    const l = level ?? 3;
    switch (level) {
      case 1:
        return (<h1 onClick={onClick}>{text}</h1>);
      case 2:
        return (<h2 onClick={onClick}>{text}</h2>);
      case 3:
        return (<h3 onClick={onClick}>{text}</h3>);
      case 4:
        return (<h4 onClick={onClick}>{text}</h4>);
      case 5:
        return (<h5 onClick={onClick}>{text}</h5>);
      case 6:
        return (<h6 onClick={onClick}>{text}</h6>);
      default:
        throw new Error(`Invalid heading level: ${level}!`);
    }
  };

  return !hide
    ? (
      <Fragment>
        {getHeading(`- ${title}`, level)}
        {children}
      </Fragment>)
    : (getHeading(`+ ${title}`, level));
}
