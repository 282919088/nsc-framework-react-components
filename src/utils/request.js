/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import router from 'umi/router';
import config from '../config';
let { loginPath,exception505 } = config();
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = error => {
  const { response, data } = error;
  if (response && response.status) {
    const { status, url } = response;
    if (data && data.msg) {
      message.warning(data.msg);
    } else {
      const errorText = codeMessage[response.status] || response.statusText;
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: errorText,
      });
    }
    if (status === 401) {
      // 清空session
      sessionStorage.removeItem('access_token');
      router.push(loginPath);
    }
    // 内部错误
    if (status <= 504 && status >= 500) {
      router.push(exception505);
    }
  }
};


/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

//请求前带token
request.interceptors.request.use((url, options) => {
  var access_token = sessionStorage.getItem('access_token');
  if (access_token) {
    options = { ...options, headers: { Authorization: `Bearer ${access_token}` } };
  }
  return ({
    url: url,
    options: options,
  });
});

/**
* 5. 对于状态码实际是 200 的错误
*/
request.interceptors.response.use(async (response, options) => {
  if (response.status == 200) {
    const result = await response.clone().json();
    if (result && result.code != 200) {
      const error = new Error(result.msg);
      error.data = result;
      error.response = response;
      throw error;
    } else if (options.callback != null) {
      options.callback.apply(options.scope || this, [result.data, response, options]);
    }
  }
  return response;
})

export default request;
