import isEmpty from 'lodash/isEmpty';
import { Toast } from 'antd-mobile';
import axios from 'axios';

const instance = axios.create({
  timeout: 30000, // 超时时间10秒
  withCredentials: true, // 表示跨域请求时是否需要使用凭证
  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
  transformRequest: [
    function(data, config) {
      // 对 data 进行任意转换处理
      var ret = [];
      if (isEmpty(data)) {
        return ret;
      }
      let requestDataType = data.requestDataType || 'JSON';
      delete data.requestDataType;
      if (requestDataType === 'FormData') {
        ret = new FormData();
        Object.keys(data).forEach(key => {
          if (typeof data[key] !== 'undefined') {
            ret.append(key, data[key]);
          }
        });
        return ret;
      } else if (requestDataType === 'JSON') {
        config['Content-Type'] = 'application/json';
        return JSON.stringify(data);
      }
      if (requestConfig.ContentType === 'application/json') {
        return JSON.stringify(data);
      }
      if (data.objectString) {
        Object.keys(data).forEach(key => {
          if (data[key]) {
            if (key === 'objectString') {
              ret.push('objectString=' + encodeURIComponent(JSON.stringify(data.objectString)));
            } else {
              ret.push(`${key}=${data[key]}`);
            }
          }
        });
      } else {
        ret.push('objectString' + '=' + encodeURIComponent(JSON.stringify(data)));
      }
      ret = ret.join('&');
      return ret;
    },
  ],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [
    function(response) {
      try {
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
        if (String(response.code) !== '200') {
          Toast.fail(response.message || '服务异常', 1);
        }
        return response;
      } catch (error) {
        console.error(error);
        Toast.fail('服务异常！', 1);
        return response;
      }
    },
  ],
});

// 添加请求拦截器
instance.interceptors.request.use(
  function(config) {
    // 设置请求头
    config.headers = {
      ...config.headers,
    };

    return config;
  },
  error => {
    console.error(error);
    Toast.fail('服务异常！', 1);
    return Promise.reject(error);
  },
);

// 添加获取截器
instance.interceptors.response.use(
  function(response) {
    return response.data;
  },
  error => {
    console.error(error);
    Toast.fail('服务异常！', 1);
    return Promise.reject(error);
  },
);
window.AXE_axios = instance;
export default instance;
