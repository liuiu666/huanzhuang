import { defineConfig } from 'umi';
export default defineConfig({
  // publicPath: '/',
  runtimePublicPath: true,
  // chainWebpack(config, { webpack }) {
  //   console.log(config, '---');
  //   // 去除线上环境console
  //   config.optimization.minimizer('TerserPlugin').use(require('terser-webpack-plugin'), [
  //     {
  //       extractComments: false,
  //       terserOptions: {
  //         compress: {
  //           drop_console: true,
  //         },
  //       },
  //     },
  //   ]);
  // },
});
