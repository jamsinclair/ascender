export default class DropFile {
  /**
   * DropFile constructor.
   * @constructs DropFile
   * @param {File} file - The File object/blob to turn into internal
   */
  constructor (file) {
    this._file = file
    this._readerPromise = this._createDataUri(file)
  }

  /**
   * Gets the Data URI of the file
   * @return {Promise} A promise that resolves with the Data URI of file
   */
  getDataUri () {
    // @TODO Do I make this synchronous?
    return this._readerPromise
  }

  /**
   * Starts the async creation of the data URI
   * @private
   * @return {Promise} A promise that resolves with the Data URI of file
   */
  _createDataUri (file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.addEventListener('load', () => {
        resolve(reader.result)
      }, false)

      reader.addEventListener('error', err => {
        reject(err)
      }, false)

      reader.readAsDataURL(file)
    })
  }
}
