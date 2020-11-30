import { isInIcestark, registerAppEnter, registerAppLeave } from '@ice/stark-app';
import ReactDOM from 'react-dom';
import productConfig from '../axeConfig/productConfig'; // 产品code配置
import '../axeConfig/axios'; // axios请求封装

// 微前端环境添加productCode重置子路由
export function patchRoutes({ routes }) {
  if (isInIcestark()) {
    routes[0].routes.forEach(item => {
      item.path = `/${productConfig.productCode}` + item.path;
    });
  }
}

// 在微前端里动态修改渲染根节点：
export function modifyClientRenderOpts(memo) {
  return {
    ...memo,
    rootElement: isInIcestark() ? 'sub-root' : memo.rootElement,
  };
}

export function render(oldRender) {
  // 在icestark 环境下注册对应的生命周期
  if (isInIcestark()) {
    registerAppEnter(() => {
      oldRender();
    });
    registerAppLeave(() => {
      ReactDOM.unmountComponentAtNode(document.getElementById('sub-root'));
    });
  } else {
    oldRender();
  }
}
