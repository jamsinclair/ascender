import resolve from 'rollup-plugin-node-resolve'
import common from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
  input: './src/ascender.js',
  output: {
    file: './dist/ascender.js',
    format: 'umd',
    name: 'Ascender'
  },
  plugins: [
    resolve(),
    common(),
    babel()
  ]
}
