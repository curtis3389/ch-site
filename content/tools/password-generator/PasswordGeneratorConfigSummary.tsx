import {ComponentChildren, ComponentProps, h, JSX, RenderableProps} from 'preact';
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
  const {config} = props;
  const parts = getStructureParts(config);
  return (<div>STRUCTURE: {parts}</div>);
}

function range(n: number): number[] {
    let numbers = [];
    for (let i = 0; i < n; ++i) {
      numbers.push(i);
    }
    return numbers;
  }

function getStructureParts(config: PasswordGeneratorConfig): JSX.Element[] {
  const leftPadding = config.paddingType === 'fixed'
    ? range(config.paddingBefore).map(() => (<StructurePart>P</StructurePart>))
    : [];
  const rightPadding = config.paddingType === 'adaptive'
    ? [
      <StructurePart>P</StructurePart>,
      <StructurePart>...</StructurePart>,
      <StructurePart>P</StructurePart>,
    ]
    : config.paddingType === 'fixed'
    ? range(config.paddingAfter).map(() => (<StructurePart>P</StructurePart>))
    : [];
  const leftDigits = range(config.digitsBefore).map(() => (<StructurePart>D</StructurePart>));
  const rightDigits = range(config.digitsAfter).map(() => (<StructurePart>D</StructurePart>));
  const middle = config.separatorType !== 'none'
  ? [
    <StructurePart>S</StructurePart>,
    ].concat(range(config.numberOfWords).map(() => [
      <StructurePart>WORD</StructurePart>,
      <StructurePart>S</StructurePart>,
    ]))
    : range(config.numberOfWords).map(() => (
      <StructurePart>WORD</StructurePart>
    ));


  return [
    ...leftPadding,
    ...leftDigits,
    ...middle,
    ...rightDigits,
    ...rightPadding,
  ];
}

export interface PropsWithChildren {
  children: ComponentChildren;
}

export function StructurePart(props: PropsWithChildren) {
  const {children} = props;
  return (<div class="structure-part">{children}</div>);
}

export function LengthSummary(props: SummaryProps) {
  const {config} = props;
  const minWordLength = config.enableMinimumWordLength
    ? config.minimumWordLength
    : english.words.map(word => word.length).reduce((prev, cur) => cur < prev ? cur : prev);
  const maxWordLength = config.enableMaximumWordLength
    ? config.maximumWordLength
    : english.words.map(word => word.length).reduce((prev, cur) => cur > prev ? cur : prev);
  const fixedPadding = config.paddingType === 'fixed'
    ? config.paddingBefore + config.paddingAfter
    : 0;
  const separatorCount = config.separatorType === 'none'
    ? 0
    : config.numberOfWords + 1;
  const baseLength = config.digitsBefore + config.digitsAfter + separatorCount + fixedPadding;
  const fixedMin = baseLength + (config.numberOfWords * minWordLength);
  const fixedMax = baseLength + (config.numberOfWords * maxWordLength);
  const min = config.paddingType === 'adaptive'
    ? Math.max(config.padToLength, fixedMin)
    : fixedMin;
  const max = config.paddingType === 'adaptive'
    ? Math.max(config.padToLength, fixedMax)
    : fixedMax;
  return min === max
    ? (<div>LENGTH: always {max} characters</div>)
    : (<div>LENGTH: between {min} and {max} characters</div>);
}

export function CoverageSummary(props: SummaryProps) {
  const {config} = props;
  const paddingCharacters = config.paddingType === 'none' || (config.paddingType === 'fixed' && config.paddingBefore === 0 && config.paddingAfter === 0)
    ? []
    : (config.paddingCharacterType === 'single'
      ? [config.paddingCharacter]
      : config.paddingCharacterType === 'random'
      ? config.paddingAlphabet
      : []);
  const separatorCharacters = config.separatorType === 'single'
    ? [config.separatorCharacter]
    : config.separatorType === 'random'
    ? config.separatorAlphabet
    : [];
  const paddingDigits = config.digitsBefore > 0 || config.digitsAfter > 0
    ? ['1']
    : [];
  function containsMatch(chars: string[], r: RegExp): boolean {
    return chars.map(c => c.match(r) !== null).reduce((prev, cur) => prev || cur, false);
  }
  function containsDigit(chars: string[]): boolean {
    return containsMatch(chars, /\d/g);
  }
  function containsSymbol(chars: string[]): boolean {
    return containsMatch(chars, /[^\da-zA-Z]/g);
  }
  function containsAlpha(chars: string[]): boolean {
    return containsMatch(chars, /[a-zA-Z]/g);
  }
  const hasDigits = containsDigit(paddingDigits) || containsDigit(paddingCharacters) || containsDigit(separatorCharacters);
  const hasSymbols = containsSymbol(paddingCharacters) || containsSymbol(separatorCharacters);
  const hasAlpha = config.numberOfWords > 0 || containsAlpha(paddingCharacters) || containsAlpha(separatorCharacters);
  return (
    <div>
      COVERAGE:
      <CoveragePart present={hasAlpha}>abcABC</CoveragePart>
      <CoveragePart present={hasDigits}>0-9</CoveragePart>
      <CoveragePart present={hasSymbols}>$ ! *</CoveragePart>
    </div>);
}

export interface CoveragePartProps extends PropsWithChildren {
  present: boolean;
}

export function CoveragePart(props: CoveragePartProps) {
  const {children, present} = props;
  return present
    ? (<div class="coverage-part coverage-part--present">{children}</div>)
    : (<div class="coverage-part">{children}</div>);
}
