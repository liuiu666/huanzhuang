import productConfig from './axeConfig/productConfig';
import { defineConfig } from 'umi';

export default defineConfig({
  title: false,
  base: productConfig.productCode,
  inlineLimit: 10000, // 小于10kb编译成base64
  history: {
    type: 'hash',
  },
  copy: [
    {
      from: 'src/static/fabric.js',
      to: 'static/fabric.js',
    },
  ],
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
  headScripts: [{ src: '/static/fabric.js' }],
  styles: [`//at.alicdn.com/t/font_2211976_2ne5xnzktul.css`],
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
