import React from 'react';
import './index.less';
class CanvasPage extends React.Component {
  state = {
    height: document.body.clientHeight,
    width: document.body.clientWidth,
    goodsid: this.props.location.query.goodsid || 9900000082,
    imgList: [],
    imgUrl: '',
  };

  componentDidMount() {
    this.handleGetCanvasData();

    this.saveHeightWidth();
  }

  // 获取图片的列表数据
  async handleGetCanvasData() {
    const { goodsid } = this.state;
    const response = await AXE_axios.post('/smzj/srCtr/oneTouchPicture', {
      // goodsid: goodsid, //可传可不传，有值查单个商品图片列表，不传查全部列表
      page: 1,
      rows: 20,
    });
    if (response.status === 0 && response.data && response.data.rows.length) {
      this.setState(
        {
          imgList: response.data.rows || [],
          imgUrl: response.data.rows[0]['pictureurl'],
        },
        () => {
          this.initialization();
        },
      );
    }
  }

  // 设置图片的高度
  saveHeightWidth() {
    window.addEventListener('resize', () => {
      this.setState({ height: document.body.clientHeight, width: document.body.clientWidth });
    });
  }

  // 初始化
  initialization() {
    const { imgUrl } = this.state;
    const canvas = new fabric.Canvas('canvas');
    fabric.Image.fromURL(imgUrl, function(img) {
      img.scale(0.3).set({
        left: 50,
        top: 50,
        centeredRotation: true,
      });
      canvas.add(img).setActiveObject(img);
    });
    this.canvas = canvas;
    // var points = [
    //   {
    //     x: 3,
    //     y: 55,
    //   },
    //   {
    //     x: 50,
    //     y: 55,
    //   },

    //   {
    //     x: 50,
    //     y: 100,
    //   },
    //   {
    //     x: 3,
    //     y: 100,
    //   },
    // ];
    // var polygon = new fabric.Polygon(points, {
    //   left: 100,
    //   top: 50,
    //   //  fill: '#D81B60',
    //   strokeWidth: 4,
    //   // stroke: 'green',
    //   // scaleX: 4,
    //   // scaleY: 4,
    //   // objectCaching: false,
    //   // transparentCorners: false,
    //   //cornerColor: 'blue',
    // });
    // canvas.viewportTransform = [0.7, 0, 0, 0.7, -50, 50];
    // canvas.add(polygon);
    // function loadPattern(url) {
    //   fabric.util.loadImage(url, function(img) {
    //     polygon.fill = new fabric.Pattern({
    //       source: img,
    //       repeat: 'no-repeat',
    //       position: 'center',
    //     });
    //     canvas.renderAll();
    //   });
    // }
    // loadPattern(imgUrl);
    // canvas.setOverlayImage(imgUrl, canvas.renderAll.bind(canvas));

    // function polygonPositionHandler(dim, finalMatrix, fabricObject) {
    //   var x = fabricObject.points[this.pointIndex].x - fabricObject.pathOffset.x,
    //     y = fabricObject.points[this.pointIndex].y - fabricObject.pathOffset.y;
    //   return fabric.util.transformPoint({ x: x, y: y }, fabric.util.multiplyTransformMatrices(fabricObject.canvas.viewportTransform, fabricObject.calcTransformMatrix()));
    // }

    // function actionHandler(eventData, transform, x, y) {
    //   var polygon = transform.target,
    //     currentControl = polygon.controls[polygon.__corner],
    //     mouseLocalPosition = polygon.toLocalPoint(new fabric.Point(x, y), 'center', 'center'),
    //     polygonBaseSize = polygon._getNonTransformedDimensions(),
    //     size = polygon._getTransformedDimensions(0, 0),
    //     finalPointPosition = {
    //       x: (mouseLocalPosition.x * polygonBaseSize.x) / size.x + polygon.pathOffset.x,
    //       y: (mouseLocalPosition.y * polygonBaseSize.y) / size.y + polygon.pathOffset.y,
    //     };
    //   polygon.points[currentControl.pointIndex] = finalPointPosition;
    //   return true;
    // }

    // function anchorWrapper(anchorIndex, fn) {
    //   return function(eventData, transform, x, y) {
    //     var fabricObject = transform.target,
    //       absolutePoint = fabric.util.transformPoint(
    //         {
    //           x: fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
    //           y: fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y,
    //         },
    //         fabricObject.calcTransformMatrix(),
    //       ),
    //       actionPerformed = fn(eventData, transform, x, y),
    //       newDim = fabricObject._setPositionDimensions({}),
    //       polygonBaseSize = fabricObject._getNonTransformedDimensions(),
    //       newX = (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) / polygonBaseSize.x,
    //       newY = (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) / polygonBaseSize.y;
    //     fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5);
    //     return actionPerformed;
    //   };
    // }

    // let poly = canvas.getObjects()[0];
    // let lastControl = poly.points.length - 1;
    // poly.cornerStyle = 'circle';
    // poly.cornerColor = 'rgba(0,0,255,0.5)';
    // poly.controls = poly.points.reduce(function(acc, point, index) {
    //   acc['p' + index] = new fabric.Control({
    //     positionHandler: polygonPositionHandler,
    //     actionHandler: anchorWrapper(index > 0 ? index - 1 : lastControl, actionHandler),
    //     actionName: 'modifyPolygon',
    //     pointIndex: index,
    //   });
    //   return acc;
    // }, {});
  }

  // 底部图片渲染
  renderImgList() {
    const { imgList } = this.state;
    return (
      <div className="img-list">
        <div className="img-icon"></div>
        <div className="img-item">
          {imgList.map((item, index) => (
            <div
              key={index}
              className="img-conent"
              onClick={() => {
                this.setState({
                  imgUrl: item.pictureurl,
                });
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
        <canvas id="canvas" height={this.state.height} width={this.state.width}></canvas>
        {this.renderImgList()}
      </div>
    );
  }
}

export default CanvasPage;
