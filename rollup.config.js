import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'

const bundleExternal = process.env.BABEL_ENV === 'umd'

const globals = {
  mitt: 'mitt',
  '@babel/runtime/helpers/defineProperty': '_defineProperty'
}
const external = ['mitt', '@babel/runtime/helpers/defineProperty']

const cjs = {
  file: './dist/cjs/index.js',
  format: 'cjs',
  globals
}

const esm = {
  file: './dist/esm/index.js',
  format: 'esm',
  globals
}

const umd = {
  file: './dist/umd/index.js',
  format: 'umd',
  name: 'Ascender',
  globals
}

const commonjsPlugin = commonjs()
const resolvePlugin = resolve({ extensions: ['.ts'] })
const babelPlugin = babel({
  babelHelpers: bundleExternal ? 'bundled' : 'runtime',
  extensions: ['.ts']
})

export default {
  input: './src/index.ts',
  external: bundleExternal ? undefined : external,
  output: bundleExternal ? [umd] : [cjs, esm],
  plugins: bundleExternal
    ? [resolvePlugin, commonjsPlugin, babelPlugin]
    : [resolvePlugin, babelPlugin]
}
