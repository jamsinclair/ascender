# Ascender

> A collection of light utilities to support Drag'n'Drop uploads. 

## Usage

Template:
```html
<form class="dropzone">Drop files or click to upload</form>
```

JavaScript:
```js
import { DropZone } from 'ascender';

const instance = DropZone(document.querySelector('.dropzone'));
instance.on('fileadded', file => {
  console.log(`${file.name} - ${file.type} - ${file.size} bytes`);
});
```

## Examples

- [Basic usage](https://githubbox.com/jamsinclair/ascender/tree/master/examples/basic)
- [Accepting files of only certain types](https://githubbox.com/jamsinclair/ascender/tree/master/examples/accept-files)
- [Showing image preview](https://githubbox.com/jamsinclair/ascender/tree/master/examples/image-preview)

---

Inspired by:
- [Dropzone.js](http://www.dropzonejs.com)
- [Draggable](https://github.com/shopify/draggable)

