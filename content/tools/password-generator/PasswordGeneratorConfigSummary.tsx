import {h} from 'preact';
import {CollapsibleSection} from './CollapsibleSection';
import {PasswordGeneratorConfig} from './PasswordGeneratorConfig';
import english from './english.json';

export interface SummaryProps {
  config: PasswordGeneratorConfig;
}

export function PasswordGeneratorConfigSummary(props: SummaryProps) {
  return (
    <CollapsibleSection title="Summary" defaultHide={false} level={3}>
      <StructureSummary {...props} />
      <LengthSummary {...props} />
      <CoverageSummary {...props} />
    </CollapsibleSection>
  );
}

export function StructureSummary(props: SummaryProps) {
  // TODO: structure summary
  return (<div></div>);
}

export function LengthSummary(props: SummaryProps) {
  const {config} = props;
  const minWordLength = config.enableMinimumWordLength
    ? config.minimumWordLength
    : english.words.map(word => word.length).reduce((prev, cur) => cur < prev ? cur : prev);
  const maxWordLength = config.enableMaximumWordLength
    ? config.maximumWordLength
    : english.words.map(word => word.length).reduce((prev, cur) => cur > prev ? cur : prev);
  const baseLength = config.digitsBefore + config.digitsAfter + config.numberOfWords + 1 + 4;
  const min = baseLength + (config.numberOfWords * minWordLength);
  const max = baseLength + (config.numberOfWords * maxWordLength);
  return (<div>LENGTH: between {min} and {max} characters</div>);
}

export function CoverageSummary(props: SummaryProps) {
  // TODO: character coverage
  return (<div></div>);
}
