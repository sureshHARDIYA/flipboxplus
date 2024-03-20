import EditorJS from '@editorjs/editorjs';

import SKMFlipBox from './lib/FlipBox';
import './style.css'

const editor = new EditorJS({
  holder: 'editorjs',
   tools: {
        flip: {
          class: SKMFlipBox,
          inlineToolbar: true
        }
      }
});

console.log('****', editor)