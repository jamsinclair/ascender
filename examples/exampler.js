import Prism from 'prismjs'

function createCodeSnippet (code, type) {
  const highlighted = Prism.highlight(code, Prism.languages[type], type)

  return `
<h3 class="uppercase">${type}</h3>
<pre><code class="language-${type}">${highlighted}</code></pre>
  `
}

function createLiveShadow (files, selector) {
  const liveExample = document.createElement('div')
  const script = document.createElement('script')
  const style = document.createElement('style')
  const html = document.createElement('div')
  const shadowRootStr = `document.querySelector('${selector} .live-example').shadowRoot.querySelector`

  liveExample.classList.add('live-example')
  const shadow = liveExample.attachShadow({ mode: 'open' })

  style.innerHTML = files.css
  // Replace document.querySelector so works within Shadow DOM
  script.innerHTML = files.js.replace(/document\.querySelector/g, shadowRootStr)
  html.innerHTML = files.html

  shadow.appendChild(style)
  shadow.appendChild(html)
  shadow.appendChild(script)

  return liveExample
}

export function renderExample (example, selector) {
  const exampleNode = document.querySelector(selector)

  exampleNode.innerHTML = createCodeSnippet(example.js, 'javascript') +
    createCodeSnippet(example.css, 'css') +
    createCodeSnippet(example.html, 'html') +
    '<h3 class="uppercase">Result</h3>'

  const liveExample = createLiveShadow(example, selector)
  exampleNode.appendChild(liveExample)
}
