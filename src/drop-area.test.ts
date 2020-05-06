import DropArea from './drop-area'

describe('DropArea Construction', () => {
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
      multipleFiles: true
    })
    expect(instanceWithCustomOptions.options).toEqual({
      classes: {
        insideDropArea: 'custom-inside-class'
      },
      clickable: false,
      multipleFiles: true
    })
  })
})