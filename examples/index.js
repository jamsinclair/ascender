import Ascender from '../src/ascender'

const dropAreaNode = document.querySelector('.drop-area')
const previewNode = document.querySelector('.preview-container')

const instance = new Ascender(dropAreaNode)

instance.on('file:added', (file) => {
  console.log('Current files: ', instance.files)

  file.getDataUri().then(uri => {
    const newImg = document.createElement('img')
    newImg.src = uri
    newImg.classList.add('image-preview')
    previewNode.appendChild(newImg)
  }).catch(err => {
    console.log('Problem showing image', err)
  })
})

if (module.hot) {
  module.hot.dispose(() => {
    window.location.reload()
  })
}
