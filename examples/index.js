import Ascender from '../src/ascender'
import fs from 'fs'
import { renderExample } from './exampler'

window.Ascender = Ascender

if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload()
  })
}

const imagePreviewExample = {
  html: fs.readFileSync(__dirname + `/image-preview/example.html`, 'utf8'),
  css: fs.readFileSync(__dirname + `/image-preview/example.css`, 'utf8'),
  js: fs.readFileSync(__dirname + `/image-preview/example.js`, 'utf8')
}

renderExample(imagePreviewExample, '.image-preview-example')
