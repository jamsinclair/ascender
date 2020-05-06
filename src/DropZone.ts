import mitt from 'mitt'

const createFileInput = (accept: string, multiple: boolean) => {
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.setAttribute('style', 'display: none')
  if (accept) {
    input.setAttribute('accept', accept)
  }
  if (multiple) {
    input.setAttribute('multiple', '')
  }
  input.addEventListener('click', event => event.stopPropagation())
  return input
}

const fileMatchesAccept = (file: File, accept: string) => {
  const types = accept.split(',')
  const matchFileExtension = type => file.name.endsWith(type)
  const matchMimeType = type => file.type === type
  return (
    types.length === 0 ||
    types.some(matchFileExtension) ||
    types.some(matchMimeType)
  )
}

const DEFAULT_OPTIONS = {
  accept: '',
  clickable: true,
  dragClass: 'ascender-dragging',
  multiple: true
}
interface DropZoneOptions {
  accept?: string
  clickable?: boolean
  dragClass?: string
  multiple?: boolean
}

export default function DropZone (
  element: Element,
  options: DropZoneOptions = {}
) {
  const _options = { ...DEFAULT_OPTIONS, ...options }
  const emitter = mitt()
  const hiddenFileInput = createFileInput(_options.accept, _options.multiple)
  hiddenFileInput.addEventListener('change', () => {
    handleFiles(hiddenFileInput.files)
    hiddenFileInput.value = ''
  })
  element.appendChild(hiddenFileInput)

  const handleFiles = files => {
    for (let file of files) {
      if (!fileMatchesAccept(file, _options.accept)) {
        continue
      }
      emitter.emit('fileadded', file)
    }
  }
  const onClick = () => {
    _options.clickable && hiddenFileInput.click()
    emitter.emit(event.type)
  }
  const onDragInside = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    emitter.emit(event.type)
    element.classList.add(_options.dragClass)
  }
  const onDragOutside = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    emitter.emit(event.type)
    element.classList.remove(_options.dragClass)
  }
  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    emitter.emit('drop')
    element.classList.remove(_options.dragClass)
    if (event.dataTransfer && event.dataTransfer.files) {
      handleFiles(event.dataTransfer.files)
    }
  }

  const toggleListeners = toggle => {
    const action = toggle ? 'addEventListener' : 'removeEventListener'
    element[action]('click', onClick)
    element[action]('dragstart', event => emitter.emit(event.type))
    element[action]('dragend', onDragOutside)
    element[action]('dragenter', onDragInside)
    element[action]('dragleave', onDragOutside)
    element[action]('dragover', onDragInside)
    element[action]('drop', onDrop)
  }

  toggleListeners(true)

  return {
    on: emitter.on,
    off: emitter.off,
    destroy () {
      if (!element) {
        return
      }
      toggleListeners(false)
      element.removeChild(hiddenFileInput)
      element = null
    }
  }
}
