import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'

export default {
  input: './src/index.ts',
  external: [ 'mitt', '@babel/runtime' ],
  output: [{
    file: './dist/cjs/index.js',
    format: 'cjs',
  }, {
    file: './dist/esm/index.js',
    format: 'esm',
  }, {
    file: './dist/umd/index.js',
    format: 'umd',
    name: 'Ascender'
  }],
  plugins: [
    resolve({ extensions: ['.ts'] }),
    babel({
      babelHelpers: 'runtime',
      extensions: ['.ts']
    })
  ]
}
