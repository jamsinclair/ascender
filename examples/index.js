import DropArea from '../src/drop-area'

window.DropArea = DropArea

const dropAreaNode = document.querySelector('.drop-area')
window.instance = new DropArea(dropAreaNode)

const stopClickNode = document.querySelector('.stop-click')
stopClickNode.addEventListener('click', e => {
  console.log('Droparea click has been stopped/captured')
  e.stopPropagation()
})

instance.on('click', (e) => {
  console.log('Droparea has been clicked')
})

instance.on('files:added', (files) => {
  console.log(files)
})
