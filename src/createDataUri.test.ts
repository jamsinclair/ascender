import createDataUri from './createDataUri'

test('creates base64 data uri string from file', async () => {
  const obj = { hello: 'world' }
  const blob = new Blob([JSON.stringify(obj, null, 2)], {
    type: 'application/json'
  })
  expect(await createDataUri(blob)).toBe(
    'data:application/json;base64,ewogICJoZWxsbyI6ICJ3b3JsZCIKfQ=='
  )
})
