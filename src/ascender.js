import { CUSTOM_EVENTS } from './events'
import Emitter from 'tiny-emitter'
import DropArea from './drop-area'
import DropFile from './drop-file'

export default class Ascender extends Emitter {
  constructor (element) {
    super()
    this.dropArea = new DropArea(element)
    this.files = []

    this._toggleListeners(true)
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
   * Toggles the listeners created by Ascender
   * @private
   * @param {Boolean} toggle - The toggle: True will add listeners, false will remove.
   */
  _toggleListeners (toggle) {
    const action = toggle ? 'on' : 'off'

    this.dropArea[action](CUSTOM_EVENTS.FILES_ADDED, files => this._onFilesAdded(files))
  }

  /**
   * Handler for when files are added after a Drop event
   * @private
   * @param {FileList} files - Files added by the DropArea
   */
  _onFilesAdded (files) {
    for (let i = 0; i < files.length; i++) {
      const fileToAdd = new DropFile(files[i])

      this.files.push(fileToAdd)
      this.emit(CUSTOM_EVENTS.FILE_ADDED, fileToAdd)
    }
  }
}
