import DropArea from './drop-area.js'

describe('DropArea Construction', () => {
  it('should error when no params given', () => {
    expect(() => {
      new DropArea()
    }).toThrow()
  })

  it('should error when non HTML element param given', () => {
    expect(() => {
      new DropArea({})
    }).toThrow()
  })

  it('should return instance with correct params', () => {
    const targetElement = document.createElement('div')
    expect(new DropArea(targetElement)).toBeInstanceOf(DropArea)
  })

  it('should correctly configure options', () => {
    const customOptions = {
      classes: {
        insideDropArea: 'custom-inside-class'
      },
      clickable: false
    }

    const instanceWithDefaultOptions = new DropArea(
      document.createElement('div')
    )
    const instanceWithCustomOptions = new DropArea(
      document.createElement('div'),
      customOptions
    )

    expect(instanceWithDefaultOptions.options).toEqual({
      classes: {
        insideDropArea: 'asc-drop-area--inside'
      },
      clickable: true,
      multipleFiles: false
    })
    expect(instanceWithCustomOptions.options).toEqual({
      classes: {
        insideDropArea: 'custom-inside-class'
      },
      clickable: false,
      multipleFiles: false
    })
  })
})
