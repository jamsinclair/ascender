import { CUSTOM_EVENTS } from './events'
import Emitter from 'tiny-emitter'
import DropArea from './drop-area'
import DropFile from './drop-file'

interface Options {
  dropArea?: any
}

export default class Ascender extends Emitter {
  dropArea = null
  files = []
  /**
   * Ascender constructor.
   * @constructs Ascender
   * @param {HTMLElement} element - The desired element for drop area
   * @param {Object} options - Options for ascender modules
   */
  constructor (element, options: Options = {}) {
    super()
    this.dropArea = new DropArea(element, options.dropArea)
    this._toggleListeners(true)
  }

  /**
   * Tidies up any listeners and logic created by Ascender
   */
  destroy () {
    if (this.dropArea) {
      this._toggleListeners(false)

      this.dropArea.destroy()
      this.dropArea = null
    }

    this.emit(CUSTOM_EVENTS.DESTROY)
  }

  /**
   * Toggles the listeners created by Ascender
   * @private
   * @param {Boolean} toggle - The toggle: True will add listeners, false will remove.
   */
  _toggleListeners (toggle) {
    const action = toggle ? 'on' : 'off'

    this.dropArea[action](CUSTOM_EVENTS.FILES_ADDED, files =>
      this._onFilesAdded(files)
    )
  }

  /**
   * Handler for when files are added after a Drop event
   * @private
   * @param {FileList} files - Files added by the DropArea
   */
  _onFilesAdded (files) {
    files.forEach(file => {
      const fileToAdd = new DropFile(file)
      this.files.push(fileToAdd)
      this.emit(CUSTOM_EVENTS.FILE_ADDED, fileToAdd)
    })
  }
}

export { DropFile, DropArea }