let configData = {
    //能源产品快速开发平台v2
    title: 'NSC Framework',
    //系统指纹，登录时候需要传递
    authorization: "Basic bnNjOm5zYw==",
    //登陆界面URL
    loginPath: '/login',
    //505错误URL
    exception505: '/exception/500',
    //403错误URL
    exception403: '/exception/403',
    //阿里图标库URL
    iconfontUrl: '//at.alicdn.com/t/font_1281254_if8a5w9ew7i.js',
};

export const setConfig = config => configData = config;
export default () => configData;