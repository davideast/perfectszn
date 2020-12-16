import { h } from 'preact';

export const EmbeddedScript = ({ script }: { script: string }) => {
  return <script dangerouslySetInnerHTML={{ __html: script}}></script>;
}