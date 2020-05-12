import { getByText, getByLabelText, fireEvent } from '@testing-library/dom'
import DropZone from './DropZone'

const setupTest = (options?) => {
  const container = document.createElement('div')
  container.innerHTML = `<div class="dropzone">
  <label for="${(options && options.id) ||
    ''}">Drop files or click to upload</label>
</div>`
  const instance = DropZone(container.querySelector('.dropzone'), options)
  return {
    container,
    instance
  }
}

test('processes dropped files', () => {
  const { container, instance } = setupTest()
  const onFiledAdded = jest.fn()
  instance.on('fileadded', onFiledAdded)
  fireEvent.drop(getByText(container, /drop files/i), {
    dataTransfer: {
      files: [
        new File(['42'], 'answertolife.json', { type: 'application/json' }),
        new File([':)'], 'selfportrait.png', { type: 'image/png' }),
        new File(['hello'], 'hello.txt', { type: 'text/plain' })
      ]
    }
  })
  expect(onFiledAdded).toBeCalledTimes(3)
})

test('processes only one dropped file when multiple is false', () => {
  const { container, instance } = setupTest({ multiple: false })
  const onFiledAdded = jest.fn()
  instance.on('fileadded', onFiledAdded)

  fireEvent.drop(getByText(container, /drop files/i), {
    dataTransfer: {
      files: [
        new File(['42'], 'answertolife.json', { type: 'application/json' }),
        new File([':)'], 'selfportrait.png', { type: 'image/png' }),
        new File(['hello'], 'hello.txt', { type: 'text/plain' })
      ]
    }
  })
  expect(onFiledAdded).toBeCalledTimes(1)
  expect(onFiledAdded.mock.calls[0][0].name).toBe('answertolife.json')
})

test('processes only files matching accept string', () => {
  const { container, instance } = setupTest({ accept: '.jpg,text/plain' })
  const onFiledAdded = jest.fn()
  instance.on('fileadded', onFiledAdded)

  fireEvent.drop(getByText(container, /drop files/i), {
    dataTransfer: {
      files: [
        new File([':('], 'selfportrait2.jpeg', { type: 'image/jpeg' }),
        new File([':)'], 'selfportrait.jpg', { type: 'image/jpeg' }),
        new File(['hello'], 'hello.txt', { type: 'text/plain' })
      ]
    }
  })
  expect(onFiledAdded).toBeCalledTimes(2)
  expect(onFiledAdded.mock.calls[0][0].name).toBe('selfportrait.jpg')
  expect(onFiledAdded.mock.calls[1][0].name).toBe('hello.txt')
})

test('processes files selected via file input', () => {
  const { container, instance } = setupTest({ id: 'test-file-input' })
  const onFiledAdded = jest.fn()
  instance.on('fileadded', onFiledAdded)
  fireEvent.change(getByLabelText(container, /click to upload/i), {
    target: {
      files: [
        new File(['42'], 'answertolife.json', { type: 'application/json' }),
        new File([':)'], 'selfportrait.png', { type: 'image/png' }),
        new File(['hello'], 'hello.txt', { type: 'text/plain' })
      ]
    }
  })
  expect(onFiledAdded).toBeCalledTimes(3)
})

test('set and removes class when drag enters and leaves', () => {
  const { container } = setupTest({ dragClass: 'test-drag' })
  fireEvent.dragOver(getByText(container, /drop files/i))
  expect(container.querySelector('.test-drag')).not.toBe(null)
  fireEvent.dragLeave(getByText(container, /drop files/i))
  expect(container.querySelector('.test-drag')).toBe(null)
})

test('destroy removes event listeners and input', () => {
  const { container, instance } = setupTest({ id: 'test-file-input' })
  const onFiledAdded = jest.fn()
  instance.on('fileadded', onFiledAdded)
  expect(container.querySelector('#test-file-input')).not.toBeNull()

  instance.destroy()
  fireEvent.change(getByText(container, /drop files/i), {
    target: {
      files: [
        new File(['42'], 'answertolife.json', { type: 'application/json' }),
        new File([':)'], 'selfportrait.png', { type: 'image/png' }),
        new File(['hello'], 'hello.txt', { type: 'text/plain' })
      ]
    }
  })
  expect(onFiledAdded).not.toHaveBeenCalled()
  expect(container.querySelector('#test-file-input')).toBeNull()
})
