export default class DropFile {
  data = null
  _dataUri = null
  _binary = null

  /**
   * DropFile constructor.
   * @constructs DropFile
   * @param {File} file - The File object/blob to turn into internal
   */
  constructor (file) {
    this.data = file
  }

  /**
   * Gets the binary data of the file
   * @return {Promise} A promise that resolves with the binary of file
   */
  getBinary () {
    return this._binary ? Promise.resolve(this._binary) : this._createBinary()
  }

  /**
   * Gets the Data URI of the file
   * @return {Promise} A promise that resolves with the Data URI of file
   */
  getDataUri () {
    return this._dataUri
      ? Promise.resolve(this._dataUri)
      : this._createDataUri()
  }

  /**
   * Starts the async creation of the file binary
   * @private
   * @return {Promise} A promise that resolves with the binary of file
   */
  _createBinary () {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        this._binary = reader.result
        resolve(this._binary)
      }
      reader.onerror = err => reject(err)
      reader.readAsArrayBuffer(this.data)
    })
  }

  /**
   * Starts the async creation of the data URI
   * @private
   * @return {Promise} A promise that resolves with the Data URI of file
   */
  _createDataUri () {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        this._dataUri = reader.result
        resolve(this._dataUri)
      }
      reader.onerror = err => reject(err)
      reader.readAsDataURL(this.data)
    })
  }
}
