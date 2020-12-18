import React from 'react';
import * as matrix from './matrix';
import { Toast } from 'antd-mobile';
import classnames from 'classnames';
import './index.less';

class CanvasPage extends React.Component {
  state = {
    height: document.body.clientHeight,
    width: document.body.clientWidth,
    goodsid: this.props.location.query.goodsid || '',
    imgList: [],
    imgUrl: '',
    resultImg: '',
    brush: false,
  };

  componentDidMount() {
    this.handleGetCanvasData();
  }

  // 获取图片的列表数据
  async handleGetCanvasData() {
    Toast.loading('Loading...', 30, () => {
      console.log('Load complete !!!');
    });
    const { goodsid } = this.state;
    const response = await AXE_axios.post('/smzj/srCtr/oneTouchPicture', {
      goodsid: goodsid, //可传可不传，有值查单个商品图片列表，不传查全部列表
      page: 1,
      rows: 200,
    });
    if (response.status === 0 && response.data && response.data.rows.length) {
      Toast.hide();
      this.setState(
        {
          imgList: response.data.rows || [],
          imgUrl: response.data.rows[0]['pictureurl'],
        },
        () => {
          this.renderCanvas();
        },
      );
    }
  }

  handleTouchStart = e => {
    let { dots } = this.allData;
    const { clientX, clientY } = e.touches[0];
    let dot, i;
    let qy = 40;
    for (i = 0; i < dots.length; i++) {
      dot = dots[i];
      this.dotIndex = i;
      if (clientY >= dot.y - qy && clientY <= dot.y + qy && clientX >= dot.x - qy && clientX <= dot.x + qy) {
        break;
      } else {
        dot = null;
      }
    }
    this.dot = dot;
  };

  listenCanvas = e => {
    const { clientX, clientY } = e.touches[0];
    if (this.state.brush) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(clientX, clientY, 10, 0, 2 * Math.PI);
      this.ctx.clip();
      this.ctx.clearRect(0, 0, document.body.clientWidth, document.body.clientHeight);
      this.ctx.restore();
    } else if (this.dot) {
      let { img, ctx, canvas, imgRatio, dots, idots, count } = this.allData;
      dots[this.dotIndex].x = clientX;
      dots[this.dotIndex].y = clientY;
      this.renderFrontCanvas({ img, ctx, canvas, imgRatio, dots, idots, count });
    }
  };

  renderCanvas = () => {
    let imgRatio = 1,
      dots = [],
      dotscopy,
      idots,
      count = 10;
    const canvas = document.getElementById('frontCanvas');

    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;
    canvas.addEventListener(
      'touchmove',
      e => {
        e.preventDefault();
      },
      { passive: false },
    );
    const ctx = canvas.getContext('2d');
    this.ctx = ctx;
    const img = new Image();
    img.src = this.state.imgUrl;
    const maxHeight = 200;
    // img.setAttribute('crossOrigin', 'sumeizhijianew');
    img.onload = () => {
      let img_w = img.width,
        img_h = img.height;
      if (img_h > maxHeight) {
        imgRatio = maxHeight / img_h;
        img_h = maxHeight;
        img_w *= imgRatio;
      }
      var left = (canvas.width - img_w) / 2;
      var top = (canvas.height - img_h) / 4;

      img.width = img_w;
      img.height = img_h;
      dots = [
        { x: left, y: top },
        { x: left + img_w, y: top },
        { x: left + img_w, y: top + img_h },
        { x: left, y: top + img_h },
      ];

      //保存一份不变的拷贝
      dotscopy = [
        { x: left, y: top },
        { x: left + img_w, y: top },
        { x: left + img_w, y: top + img_h },
        { x: left, y: top + img_h },
      ];
      // 获得所有初始点坐标
      idots = matrix.rectsplit(count, dotscopy[0], dotscopy[1], dotscopy[2], dotscopy[3]);
      this.renderFrontCanvas({ img, ctx, canvas, imgRatio, dots, idots, count });
      this.allData = { img, ctx, canvas, imgRatio, dots, idots, count };
    };
  };

  renderFrontCanvas = ({ img, ctx, canvas, imgRatio, dots, idots, count }) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dots.forEach(item => {
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgb(68, 151, 102)';
      ctx.arc(item.x, item.y, 3, 0, Math.PI * 2, false);
      ctx.stroke();
    });

    var ndots = matrix.rectsplit(count, dots[0], dots[1], dots[2], dots[3]);
    /**
     * 计算矩阵，同时渲染图片
     * @param arg_1
     * @param _arg_1
     * @param arg_2
     * @param _arg_2
     * @param arg_3
     * @param _arg_3
     */
    function renderImage(arg_1, _arg_1, arg_2, _arg_2, arg_3, _arg_3, vertex) {
      ctx.save();
      //根据变换后的坐标创建剪切区域
      ctx.beginPath();
      ctx.moveTo(_arg_1.x, _arg_1.y);
      ctx.lineTo(_arg_2.x, _arg_2.y);
      ctx.lineTo(_arg_3.x, _arg_3.y);
      ctx.closePath();
      // if (hasRect) {
      //   ctx.lineWidth = 2;
      //   ctx.strokeStyle = 'red';
      //   ctx.stroke();
      // }
      ctx.clip();
      //传入变换前后的点坐标，计算变换矩阵
      var result = matrix.getMatrix.apply(this, arguments);
      //变形
      ctx.transform(result.a, result.b, result.c, result.d, result.e, result.f);
      var w = img.width / count;
      var h = img.height / count;
      //绘制图片
      ctx.drawImage(img, (vertex.x - idots[0].x) / imgRatio - 1, (vertex.y - idots[0].y) / imgRatio - 1, w / imgRatio + 2, h / imgRatio + 2, vertex.x - 1, vertex.y - 1, w + 2, h + 2);
      ctx.restore();
    }

    ndots.forEach(function(d, i) {
      //获取平行四边形的四个点
      var dot1 = ndots[i];
      var dot2 = ndots[i + 1];
      var dot3 = ndots[i + count + 2];
      var dot4 = ndots[i + count + 1];

      //获取初始平行四边形的四个点
      var idot1 = idots[i];
      var idot2 = idots[i + 1];
      var idot3 = idots[i + count + 2];
      var idot4 = idots[i + count + 1];

      if (dot2 && dot3 && i % (count + 1) < count) {
        //绘制三角形的下半部分
        renderImage(idot3, dot3, idot2, dot2, idot4, dot4, idot1);

        //绘制三角形的上半部分
        renderImage(idot1, dot1, idot2, dot2, idot4, dot4, idot1);
      }
      // if ("hasDot") {
      //   ctx.fillStyle = 'red';
      //   ctx.fillRect(d.x - 1, d.y - 1, 2, 2);
      // }
    });
  };

  handleGetImg = e => {
    const that = this;
    if (e.currentTarget.files) {
      let file = e.currentTarget.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file); //发起异步请求
      reader.onload = function() {
        //读取完成后，数据保存在对象的result属性中
        that.setState({
          resultImg: this.result,
        });
      };
    }
  };

  handleHideImg = () => {
    let { img, ctx, canvas, imgRatio, dots, idots, count } = this.allData;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (this.hideImg) {
      this.renderFrontCanvas({ img, ctx, canvas, imgRatio, dots, idots, count });
    }
    this.hideImg = !this.hideImg;
  };

  handleFuYuan = () => {
    this.setState({
      resultImg: '',
    });
    this.renderCanvas();
  };

  handleSaveImg = () => {
    const { resultImg } = this.state;
    try {
      const canvas = document.getElementById('frontCanvas');
      let src = canvas.toDataURL('image/png');
      if (resultImg) {
        this.convertImageToCanvas(src);
      } else {
        this.downImg(src);
      }
    } catch (error) {
      console.error(error);
      Toast.fail('服务异常！', 1);
    }
  };

  downImg = src => {
    let a = document.createElement('a'); // 生成一个a元素
    let event = new MouseEvent('click'); // 创建一个单击事件
    a.download = name || 'photo'; // 设置图片名称
    a.href = src; // 将生成的URL设置为a.href属性,url可以是base64
    a.dispatchEvent(event); // 触发a的单击事件
  };

  convertCanvasToImage(canvas) {
    var image = new Image();
    image.src = canvas.toDataURL('image/png');
    return image;
  }

  convertImageToCanvas = src => {
    const { resultImg } = this.state;
    const that = this;
    // 创建canvas DOM元素，并设置其宽高和图片一样
    var canvas = document.createElement('canvas');
    let image = new Image();
    image.src = resultImg;

    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth;

    let ctx2d = canvas.getContext('2d');
    image.onload = () => {
      ctx2d.drawImage(image, 0, 0, canvas.width, canvas.height);
      draw();
    };
    function draw() {
      var img2 = new Image();
      img2.src = src;
      img2.onload = () => {
        ctx2d.drawImage(img2, 0, 0, canvas.width, canvas.height);
        const imgs = canvas.toDataURL('image/jpg');
        that.downImg(imgs);
      };
    }
    // return canvas;
  };

  // 底部图片渲染
  renderImgList() {
    const { imgList } = this.state;
    return (
      <div className="img-list">
        <div className="img-icon">
          <div onClick={this.handleGetImg}>
            <input id="preview" accept=".jpg, .jpeg, .png" className="input-file" type="file" onChange={this.handleGetImg} />
            <span>
              <i className="icon-xiangji iconfont"></i>
            </span>
            <span>拍实景</span>
          </div>
          <div onClick={this.handleHideImg}>
            <span>
              <i className="icon-yincang iconfont"> </i>
            </span>
            <span>隐窗帘</span>
          </div>
          <div
            className={classnames({
              activeButton: this.state.brush,
              activeButtonFalse: !this.state.brush,
            })}
            onClick={() => {
              this.setState({
                brush: !this.state.brush,
              });
            }}
          >
            <span>
              <i className="iconfont icon-xiangpi_huaban1"></i>
            </span>
            <span>刷窗帘</span>
          </div>
          <div onClick={this.handleFuYuan}>
            <span>
              <i className="iconfont icon-web-icon-"></i>
            </span>
            <span>复原</span>
          </div>
          <div onClick={this.handleSaveImg}>
            <span>
              <i className="iconfont icon-baocun"></i>
            </span>
            <span>保存</span>
          </div>
        </div>
        <div className="img-item">
          {imgList.map((item, index) => (
            <div
              key={index}
              className={classnames({
                'img-conent': true,
                active: this.state.imgUrl === item.pictureurl,
              })}
              onClick={() => {
                this.setState(
                  {
                    imgUrl: item.pictureurl,
                  },
                  () => {
                    this.renderCanvas();
                  },
                );
              }}
            >
              <img src={item.pictureurl} alt="图片加载中" style={{ width: '100%', height: '100%', verticalAlign: 'top' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="canvas-home">
        <img className="canvas-home-img" src={this.state.resultImg} />
        <canvas id="frontCanvas" onTouchMove={this.listenCanvas} onTouchStart={this.handleTouchStart}></canvas>
        {this.renderImgList()}
      </div>
    );
  }
}

export default CanvasPage;
