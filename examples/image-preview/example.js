const dropAreaNode = document.querySelector('.drop-area')
const previewNode = document.querySelector('.preview-container')

const instance = new Ascender(dropAreaNode)

instance.on('file:added', (file) => {
  file.getDataUri().then(uri => {
    const newImg = document.createElement('img')
    newImg.src = uri
    newImg.classList.add('image-preview')
    previewNode.appendChild(newImg)
  })
})
