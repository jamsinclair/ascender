import mitt from 'mitt'

const createFileInput = (accept: string, id: string, multiple: boolean) => {
  const input = document.createElement('input')
  input.setAttribute('id', id)
  input.setAttribute('style', 'display: none')
  input.setAttribute('type', 'file')
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
  id: 'ascender-file-input',
  multiple: true
}
interface DropZoneOptions {
  accept?: string
  clickable?: boolean
  dragClass?: string
  id?: string
  multiple?: boolean
}

export default function DropZone (
  element: Element,
  options: DropZoneOptions = {}
) {
  const { accept, clickable, dragClass, id, multiple } = {
    ...DEFAULT_OPTIONS,
    ...options
  }
  const emitter = mitt()
  const hiddenFileInput = createFileInput(accept, id, multiple)
  hiddenFileInput.addEventListener('change', () => {
    handleFiles(hiddenFileInput.files)
    hiddenFileInput.value = ''
  })
  element.appendChild(hiddenFileInput)

  const handleFiles = files => {
    for (let file of files) {
      if (!fileMatchesAccept(file, accept)) {
        continue
      }
      emitter.emit('fileadded', file)
      if (!multiple) {
        break
      }
    }
  }
  const onClick = (event: MouseEvent) => {
    clickable && hiddenFileInput.click()
    emitter.emit('click', event)
  }
  const onDragInside = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    emitter.emit(event.type, event)
    element.classList.add(dragClass)
  }
  const onDragOutside = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    emitter.emit(event.type, event)
    element.classList.remove(dragClass)
  }
  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    event.stopPropagation()
    emitter.emit('drop', event)
    element.classList.remove(dragClass)
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
