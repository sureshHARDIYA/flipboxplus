import EditorJS from '@editorjs/editorjs';

import SKMFlipBox from './lib/FlipBox';
import './style.css'

const editor = new EditorJS({
  /**
   * Id of Element that should contain Editor instance
   */
  holder: 'editorjs',
   tools: {
        image: SKMFlipBox
      }
});

console.log('****', editor)