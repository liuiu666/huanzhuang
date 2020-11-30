import React from 'react';
import BaseLayouts from './baseLayout';
import TabBarConfig from './tabBarConfig';
import './index.less';
class Layouts extends React.Component {
  render() {
    return this.props.children;
    // const pathname = this.props.location.pathname;
    // // tabBar路由才显示tableBar
    // const TabBarConfigTitle = TabBarConfig.map(item => item.url);
    // if (TabBarConfigTitle.includes(pathname)) {
    //   return <BaseLayouts {...this.props}>{this.props.children}</BaseLayouts>;
    // } else {
    //   return this.props.children;
    // }
  }
}
export default Layouts;
