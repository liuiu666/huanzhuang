import React from 'react';
import { Carousel } from 'antd-mobile';
import { history } from 'umi';
import style from './index.less';

// 信息-首页
class Home extends React.Component {
  state = {
    bannerList: ['AiyWuByWklrrUDlFignR', 'TekJlZRVCjLFexlOCuWn', 'IJOtIlfsYdTyaDTRVrLI'],
    imgHeight: document.body.clientHeight * 0.55,
    bannerIndex: 1,
    detail: [
      {
        title: '名称',
        content: '345犀利',
      },
    ],
  };

  componentDidMount() {
    window.addEventListener('resize', () => {
      // 设置图片的高度
      this.setState({ imgHeight: document.body.clientHeight * 0.55 });
    });
  }

  // 详情模块
  renderDetailList() {
    const { detail } = this.state;
    return (
      <ul>
        {detail.map((item, index) => (
          <li className="detail-item" key={index}>
            <span className="title">{item.title}:</span>
            <span className="detail">{item.content}</span>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div className={style['home-page']}>
        <header className="ui_bottom_1px">
          <Carousel autoplay={true} infinite dots={false} afterChange={index => this.setState({ bannerIndex: index + 1 })}>
            {this.state.bannerList.map((val, i) => (
              <div className="banner-img" style={{ height: this.state.imgHeight }} key={i}>
                <img src={`https://zos.alipayobjects.com/rmsportal/${val}.png`} alt="" style={{ width: '100%', height: '100%' }} />
              </div>
            ))}
          </Carousel>
          <span className="banner-number">
            {this.state.bannerIndex}/{this.state.bannerList.length}
          </span>
        </header>
        <main>{this.renderDetailList()}</main>
        <div className="home-icon" onClick={() => history.push('/canvas')}>
          <span>窗帘</span>
          <span>试装</span>
        </div>
      </div>
    );
  }
}

export default Home;
