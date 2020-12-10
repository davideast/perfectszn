
export type PreactProps = Readonly<preact.Attributes & {
  children?: preact.ComponentChildren;
  ref?: preact.Ref<any>;
}>

export interface SznTopic { text: string; id: string };

export interface SznCategory {
  title: string;
  topics: SznTopic[];
}
