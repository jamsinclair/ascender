import Emitter from 'tiny-emitter'
import { NATIVE_EVENTS, CUSTOM_EVENTS } from './events'

const DEFAULT_OPTIONS = {
  multipleFiles: true,
  clickable: true,
  classes: {
    insideDropArea: 'asc-drop-area--inside'
  }
}

/**
 * Makes an existing element a droppable area that fires events on drag 'n' drop of files.
 *
 * @class DropArea
 * @module DropArea
 * @extends Emitter
 */
export default class DropArea extends Emitter {
  /**
   * DropArea constructor.
   * @constructs DropArea
   * @param {HTMLElement} element - The desired element for drop area
   * @param {Object} options - Options for DropArea
   */
  constructor (element, options = {}) {
    super()

    if (!(element instanceof HTMLElement)) {
      throw new Error(
        '[Ascender.DropArea] An HTMLElement must be passed to constructor'
      )
    }

    this.options = Object.assign({}, DEFAULT_OPTIONS, options)
    this._element = element

    this._toggleListeners(true)
    this._configureHiddenFileInput()
  }

  /**
   * Removes any listeners and logic bound to the DropArea instance.
   */
  destroy () {
    if (this._element) {
      this._toggleListeners(false)
      this.emit(CUSTOM_EVENTS.DESTROY)
    }
  }

  /**
   * An event delegator that calls the intended method based on event type.
   * @param {Event} event - The triggered event object
   */
  handleEvent (event) {
    if (
      !this._element.isSameNode(event.target) &&
      !this._element.contains(event.target)
    ) {
      return
    }

    switch (event.type) {
      case NATIVE_EVENTS.CLICK:
        this._onClick()
        break
      case NATIVE_EVENTS.DROP:
        event.preventDefault()
        this._onDrop(event)
        break
      case NATIVE_EVENTS.DRAG_ENTER:
      case NATIVE_EVENTS.DRAG_OVER:
        event.preventDefault()
        this._onInsideDropArea()
        break
      case NATIVE_EVENTS.DRAG_END:
      case NATIVE_EVENTS.DRAG_LEAVE:
        this._onOutsideDropArea()
        break
    }

    this.emit(event.type, event)
  }

  /**
   * Toggles the listeners bound to the DropArea element.
   * @param {Boolean} toggle - The toggle: True will add listeners, false will remove.
   */
  _toggleListeners (toggle) {
    const action = toggle ? 'addEventListener' : 'removeEventListener'

    this._element[action](NATIVE_EVENTS.CLICK, this)
    this._element[action](NATIVE_EVENTS.DRAG_START, this)
    this._element[action](NATIVE_EVENTS.DRAG_END, this)
    this._element[action](NATIVE_EVENTS.DRAG_ENTER, this)
    this._element[action](NATIVE_EVENTS.DRAG_LEAVE, this)

    // The following events need to be bound to the window to successfully prevent default actions
    window[action](NATIVE_EVENTS.DRAG_OVER, this)
    window[action](NATIVE_EVENTS.DROP, this)
  }

  /**
   * Adds a hidden file input within the DropArea for triggering file uploads on click
   */
  _configureHiddenFileInput () {
    if (this._hiddenFileInput) {
      this._element.removeChild(this._hiddenFileInput)
    }

    const input = document.createElement('input')
    const styles = {
      position: 'absolute',
      opacity: 0,
      top: 0,
      left: 0,
      height: 0,
      width: 0
    }

    input.setAttribute('type', 'file')

    if (this.options.multipleFiles) {
      input.setAttribute('multiple', 'multiple')
    }

    input.addEventListener(NATIVE_EVENTS.CLICK, event => {
      // Stops the invoked file input click bubbling and triggering parent listeners
      event.stopPropagation()
    })
    input.addEventListener(NATIVE_EVENTS.CHANGE, event => {
      const { files } = input

      this._onFilesAdded(files)
      this._configureHiddenFileInput()
    })

    Object.assign(input.style, styles)
    this._hiddenFileInput = input
    this._element.appendChild(input)
  }

  /**
   * Handler for when a drag event occurs within the DropArea
   */
  _onInsideDropArea () {
    this._element.classList.add(this.options.classes.insideDropArea)
  }

  /**
   * Handler for when a drag event occurs when leaving the DropArea
   */
  _onOutsideDropArea () {
    this._element.classList.remove(this.options.classes.insideDropArea)
  }

  /**
   * Handler for when a click event occurs within the DropArea
   */
  _onClick (event) {
    if (this.options.clickable && this._hiddenFileInput) {
      this._hiddenFileInput.click()
    }
  }

  /**
   * Handler for when a drop event occurs within the DropArea
   */
  _onDrop (event) {
    if (event.dataTransfer && event.dataTransfer.files) {
      this._onFilesAdded(event.dataTransfer.files)
    }

    this._element.classList.remove(this.options.classes.insideDropArea)
  }

  /**
   * Handler for when a files are added after a Drop event
   */
  _onFilesAdded (files) {
    if (!files.length) {
      return
    }

    // Only return one file, unless multiple files option set
    const filesToAdd = this.options.multipleFiles ? files : [files[0]]

    this.emit(CUSTOM_EVENTS.FILES_ADDED, filesToAdd)
  }
}
