import { FunctionalComponent, h } from 'preact';
import { ARVO_BASE64 } from '../fonts/Arvo';
import { KARLA_BASE64 } from '../fonts/Karla';

export const EmbeddedFonts: FunctionalComponent = () => {
    const fontFamily = `
    @font-face {
        font-family: 'Arvo';
        src: url('${ARVO_BASE64}');
      }
      @font-face {
        font-family: 'Karla';
        src: url('${KARLA_BASE64}');
      }
    `;
    return (
      <style dangerouslySetInnerHTML={{ __html: fontFamily}}></style>
    );
}
