import productConfig from './axeConfig/productConfig';
import { defineConfig } from 'umi';

export default defineConfig({
  title: false,
  base: productConfig.productCode,
  inlineLimit: 10000, // 小于10kb编译成base64
  history: {
    type: 'hash',
  },
  theme: {},
  hash: false,
  outputPath: './build',
  nodeModulesTransform: {
    type: 'none',
  },
  locale: {
    default: 'zh-CN',
    antd: false,
    title: false,
    baseNavigator: true,
    baseSeparator: '-',
  },
  plugins: [],
  alias: {
    '@': './src',
  },
  //headScripts: [{ src: '/static/fabric.js' }, { src: '/static/warper.js' }, { src: '/static/fabric-warp-image.js' }],
  styles: [`//at.alicdn.com/t/font_1185901_tfz5djn9uvn.css`],
  chainWebpack(config, { webpack }) {
    config.plugin('extract-css').tap(() => [
      {
        filename: `main.css`,
        chunkFilename: `[name].chunk.css`,
        ignoreOrder: true,
      },
    ]);
    config.output.filename('app.js');
  },
  proxy: {
    '/smzj': {
      target: 'https://smzj.sumeizhijia.com',
      changeOrigin: true,
      // pathRewrite: { '^/api': '' },
    },
  },
});
