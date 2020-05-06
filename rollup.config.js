import resolve from '@rollup/plugin-node-resolve'
import common from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

export default {
  input: './src/index.ts',
  output: [{
    file: './dist/cjs/index.js',
    format: 'cjs',
  }, {
    file: './dist/umd/index.js',
    format: 'umd',
    name: 'Ascender'
  }],
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
