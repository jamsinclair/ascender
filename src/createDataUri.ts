export default function (file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    // onerror is very unlikely to be called
    // Cannot create a bad blob to test
    // istanbul ignore next
    reader.onerror = err => reject(err)
    reader.readAsDataURL(file)
  })
}
