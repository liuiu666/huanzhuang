import React from 'react';
import { Carousel } from 'antd-mobile';
import { history } from 'umi';
import style from './index.less';

// 信息-首页
class Home extends React.Component {
  state = {
    bannerList: [],
    imgHeight: document.body.clientHeight * 0.55,
    bannerIndex: 1,
    detail: [],
    goodsid: this.props.location.query.goodsid || 9900000082,
  };

  componentDidMount() {
    window.addEventListener('resize', () => {
      // 设置图片的高度
      this.setState({ imgHeight: document.body.clientHeight * 0.55 });
    });
    this.handleGetDetaileList();
  }

  /**
   * 获取详情数据
   */
  async handleGetDetaileList() {
    const { goodsid } = this.state;
    const response = await AXE_axios.post('/smzj/srCtr/wxQrGoodsid', { goodsid: goodsid });
    if (response.status === 0 && response.data) {
      this.setState({
        bannerList: response.data.goodstopurl || [],
        detail: response.data.categoryXcxQrs || [],
      });
    }
  }

  // 详情模块
  renderDetailList() {
    const { detail } = this.state;
    return (
      <ul>
        {detail.map((item, index) => (
          <li className="detail-item" key={index}>
            <span className="title">{item.superCategoryName}:</span>
            <span className="detail">{item.categoryName}</span>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const { goodsid } = this.state;
    return (
      <div className={style['home-page']}>
        <header className="ui_bottom_1px">
          <Carousel autoplay={true} infinite dots={false} afterChange={index => this.setState({ bannerIndex: index + 1 })}>
            {this.state.bannerList.map((val, i) => (
              <div className="banner-img" style={{ height: this.state.imgHeight }} key={i}>
                <img
                  src={val.goodstopurl}
                  alt="图片加载中"
                  style={{ width: '100%', height: '100%', verticalAlign: 'top' }}
                  onLoad={() => {
                    window.dispatchEvent(new Event('resize'));
                    this.setState({ imgHeight: document.body.clientHeight * 0.55 });
                  }}
                />
              </div>
            ))}
          </Carousel>
          <span className="banner-number">
            {this.state.bannerIndex}/{this.state.bannerList.length}
          </span>
        </header>
        <main>{this.renderDetailList()}</main>
        <div className="home-icon" onClick={() => history.push(`/canvas?goodsid=${goodsid}`)}>
          <span>窗帘</span>
          <span>试装</span>
        </div>
      </div>
    );
  }
}

export default Home;
