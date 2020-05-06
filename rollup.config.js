import resolve from '@rollup/plugin-node-resolve'
import common from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

export default {
  input: './src/ascender.ts',
  output: {
    file: './dist/ascender.js',
    format: 'umd',
    name: 'Ascender'
  },
  plugins: [
    resolve({ extensions: ['.ts'] }),
    common(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      extensions: ['.ts']
    })
  ]
}
