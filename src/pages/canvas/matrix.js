/**
 * Created by wanghx on 2015/7/12.
 * 矩阵计算组件
 */

/**
 * 根据变化前后的点坐标，计算矩阵
 * @param arg_1     变化前坐标1
 * @param _arg_1    变化后坐标1
 * @param arg_2     变化前坐标2
 * @param _arg_2    变化后坐标2
 * @param arg_3     变化前坐标3
 * @param _arg_3    变化后坐标3
 * @returns {{a: number, b: number, c: number, d: number, e: number, f: number}}
 */
function getMatrix(arg_1, _arg_1, arg_2, _arg_2, arg_3, _arg_3) {
  //传入x值解第一个方程 即  X = ax + cy + e 求ace
  //传入的四个参数，对应三元一次方程：ax+by+cz=d的四个参数：a、b、c、d，跟矩阵方程对比c为1
  var arr1 = [arg_1.x, arg_1.y, 1, _arg_1.x];
  var arr2 = [arg_2.x, arg_2.y, 1, _arg_2.x];
  var arr3 = [arg_3.x, arg_3.y, 1, _arg_3.x];

  var result = equation(arr1, arr2, arr3);

  //传入y值解第二个方程 即  Y = bx + dy + f 求 bdf
  arr1[3] = _arg_1.y;
  arr2[3] = _arg_2.y;
  arr3[3] = _arg_3.y;

  var result2 = equation(arr1, arr2, arr3);

  //获得a、c、e
  var a = result.x;
  var c = result.y;
  var e = result.z;

  //获得b、d、f
  var b = result2.x;
  var d = result2.y;
  var f = result2.z;

  return {
    a: a,
    b: b,
    c: c,
    d: d,
    e: e,
    f: f,
  };
}

/**
 * 解三元一次方程，需要传入三组方程参数
 * @param arr1        第一组参数
 * @param arr2        第二组参数
 * @param arr3        第三组参数
 * @returns {{x: number, y: number, z: number}}
 */

function equation(arr1, arr2, arr3) {
  var a1 = +arr1[0];
  var b1 = +arr1[1];
  var c1 = +arr1[2];
  var d1 = +arr1[3];

  var a2 = +arr2[0];
  var b2 = +arr2[1];
  var c2 = +arr2[2];
  var d2 = +arr2[3];

  var a3 = +arr3[0];
  var b3 = +arr3[1];
  var c3 = +arr3[2];
  var d3 = +arr3[3];

  //分离计算单元
  var m1 = c1 - (b1 * c2) / b2;
  var m2 = c2 - (b2 * c3) / b3;
  var m3 = d2 - (b2 * d3) / b3;
  var m4 = a2 - (b2 * a3) / b3;
  var m5 = d1 - (b1 * d2) / b2;
  var m6 = a1 - (b1 * a2) / b2;

  //计算xyz
  var x = ((m1 / m2) * m3 - m5) / ((m1 / m2) * m4 - m6);
  var z = (m3 - m4 * x) / m2;
  var y = (d1 - a1 * x - c1 * z) / b1;

  return {
    x: x,
    y: y,
    z: z,
  };
}

/**
 * 将 abcd 四边形分割成 n 的 n 次方份，获取 n 等分后的所有点坐标
 * @param n     多少等分
 * @param a     a 点坐标
 * @param b     b 点坐标
 * @param c     c 点坐标
 * @param d     d 点坐标
 * @returns {Array}
 */
function rectsplit(n, a, b, c, d) {
  // ad 向量方向 n 等分
  var ad_x = (d.x - a.x) / n;
  var ad_y = (d.y - a.y) / n;
  // bc 向量方向 n 等分
  var bc_x = (c.x - b.x) / n;
  var bc_y = (c.y - b.y) / n;

  var ndots = [];
  var x1, y1, x2, y2, ab_x, ab_y;

  //左边点递增，右边点递增，获取每一次递增后的新的向量，继续 n 等分，从而获取所有点坐标
  for (var i = 0; i <= n; i++) {
    //获得 ad 向量 n 等分后的坐标
    x1 = a.x + ad_x * i;
    y1 = a.y + ad_y * i;
    //获得 bc 向量 n 等分后的坐标
    x2 = b.x + bc_x * i;
    y2 = b.y + bc_y * i;

    for (var j = 0; j <= n; j++) {
      // ab 向量为：[x2 - x1 , y2 - y1]，所以 n 等分后的增量为除于 n
      ab_x = (x2 - x1) / n;
      ab_y = (y2 - y1) / n;

      ndots.push({
        x: x1 + ab_x * j,
        y: y1 + ab_y * j,
      });
    }
  }

  return ndots;
}

export { getMatrix, equation, rectsplit };
