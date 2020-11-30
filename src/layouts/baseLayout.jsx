import React from 'react';
import { history } from 'umi';
import { TabBar } from 'antd-mobile';
import TabBarConfig from './tabBarConfig';
import style from './index.less';

class BaseLayouts extends React.Component {
  render() {
    const pathname = this.props.location.pathname;
    return (
      <div className={style['base-layouts']}>
        <TabBar unselectedTintColor="#666666" tintColor="#1890FF" barTintColor="white" tabBarPosition="bottom">
          {TabBarConfig.map((item, index) => {
            return (
              <TabBar.Item
                title={item.title}
                key={item.url}
                icon={<div className="icon" />}
                selectedIcon={<div className="icon select-icon" />}
                onPress={() => history.push(item.url)}
                selected={item.url === pathname}
                data-seed="logId"
              >
                {this.props.children}
              </TabBar.Item>
            );
          })}
        </TabBar>
      </div>
    );
  }
}
export default BaseLayouts;
