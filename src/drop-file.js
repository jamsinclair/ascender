export default class DropFile {
  /**
   * DropFile constructor.
   * @constructs DropFile
   * @param {File} file - The File object/blob to turn into internal
   */
  constructor (file) {
    this.data = file
    this._dataUri = null
  }

  /**
   * Gets the Data URI of the file
   * @return {Promise} A promise that resolves with the Data URI of file
   */
  getDataUri () {
    return this._dataUri ? Promise.resolve(this._dataUri) : this._createDataUri()
  }

  /**
   * Starts the async creation of the data URI
   * @private
   * @return {Promise} A promise that resolves with the Data URI of file
   */
  _createDataUri () {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        () => {
          resolve(reader.result)
        },
        false
      )

      reader.addEventListener(
        'error',
        err => {
          reject(err)
        },
        false
      )

      reader.readAsDataURL(this.data)
    })
  }
}
