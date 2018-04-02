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
    const instance = new DropArea(document.createElement('div'), customOptions)

    expect(instance.options).toEqual({
      classes: {
        insideDropArea: 'custom-inside-class'
      },
      clickable: false
    })
  })
})
