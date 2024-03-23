# EditorJS Carousel Plugin

**EditorJS Carousel Plugin** is a custom tool for the [EditorJS](https://editorjs.io/) framework that enables users to add, edit, and delete text carousels within the editor. This plugin provides a seamless way for users to incorporate carousel components into their EditorJS content, complete with formatting options available through the inline toolbar.

## Features

- Add new carousels to your EditorJS content.
- Edit and delete existing carousels.
- Format text within carousels using the available inline toolbar options.

## Installation

To install the EditorJS Carousel Plugin, follow these steps:

1. Install EditorJS if you haven't already:

   ```bash
   npm i skm-flipbox
   ```
2. Add it to your èditorjs` configuration. 
```
import EditorJS from '@editorjs/editorjs';
import SKMFlipBox from 'skm-flipbox';

const editor = new EditorJS({
  // Your EditorJS configuration
  tools: {
    carousel: {
      class: SKMFlipBox,
      inlineToolbar: true, 
    },
    // Other tools...
  },
});

```

### Demo

![Demo](demo.gif)