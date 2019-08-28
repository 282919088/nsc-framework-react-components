import React, { PureComponent } from 'react';
import utils from '../../utils/utils';

class NscPageRequest extends PureComponent {
    //返回值
    returnValue = null

    state = {
        visible: false,
        title: '新增'
    }

    option = {
        //回调作用域
        scope: this,
        //open传递过来的页面参数
        params: {},
        //可以描述窗口
        type: null,
        //关闭之前回调，如果return false，且窗口不关闭
        callbackBeforeClose: null,
        //关闭后回调，异步操作
        callback: null,
    }

    /**
     * 渲染完成
     * @param {*} params 传递过来的参数对象
     * @param {*} type  可以描述窗口类型
     * @param {*} option  整改传递对象
     */
    beforeRender(params, type, option) {

    }

    //显示
    show(option = {}) {
        var _this = this;
        this.setState({ visible: true });
        this.option = option;
        _this.beforeRender(option.params, option.type, option);
    }

    //隐藏
    hide() {
        this.setState({ visible: false });
    }

    //设置需要返回的值
    setReturnValue(returnValue) {
        this.returnValue = returnValue;
    }

    //获取需要返回的值
    getReturnValue() {
        return this.returnValue;
    }

    /**
     * 关闭带回调
     */
    close(result) {
        var _this = this;
        const { callback, scope, callbackBeforeClose } = this.option;
        if (result) this.setReturnValue(result);
        const r = utils.callback(callbackBeforeClose, scope, [this.returnValue]);
        if (r !== false) this.setState({ visible: false });
        utils.callback(callback, scope, [_this.returnValue]);
        // setTimeout(function (callback, scope) {
        //     utils.callback(callback, scope, [_this.returnValue]);
        // }, 1000, callback, scope);
    }

    /**
     * 获取参数，如果key不传递，且获取全部
     * @param {String} key 
     */
    getParams(key) {
        if (key) return this.option.params[key];
        return this.option.params;
    }

    /**
     * 修改传递值
     * @param {Object} key  如果key为Object，且覆盖全部参数，如果key为String，且使用value覆盖指定的key值
     * @param {*} value 数值
     */
    setParams(key, value) {
        if (utils.isString(key)) {
            this.option.params[key] = value;
        } else if (utils.isObject(key)) {
            this.option.params = key;
        }
        return this;
    }

    getType() {
        return this.option.type;
    }

    setType(type) {
        this.option.type = type;
    }
}

export default NscPageRequest;