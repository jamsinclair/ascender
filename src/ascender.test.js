import Ascender from './ascender'

describe('Ascender Construction', () => {
  it('should error when no params given', () => {
    expect(() => {
      new Ascender()
    }).toThrow()
  })

  it('should error when non HTML element param given', () => {
    expect(() => {
      new Ascender({})
    }).toThrow()
  })

  it('should return instance with correct params', () => {
    const targetElement = document.createElement('div')
    expect(new Ascender(targetElement)).toBeInstanceOf(Ascender)
  })
})
