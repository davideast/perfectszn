
export type PreactProps = Readonly<preact.Attributes & {
  children?: preact.ComponentChildren;
  ref?: preact.Ref<any>;
}>

export interface SznTopic { text: string; id: string };

export interface SznCategory {
  id: string;
  title: string;
  topics: SznTopic[];
}
