import TreeModel from '../Model/TreeModel';
import Model from '../Model/Model';
import utils from '../../../utils/utils';
import request from '../../../utils/request';

class Store {

    config = {
        //react组件
        component: undefined,
        //是否自动加载
        autoLoad: undefined,
        //请求url
        url: undefined,
        //数据模型
        model: undefined,
        //监听
        listeners: {
            //数据加载前回调
            onBeforeLoad: undefined,
            //数据加载完成回调
            load: undefined,
            //数据变动回调
            datachanged: undefined,
        }
    }

    constructor(props) {
        let _this = this;
        this.config = { ...this.config, ...props };
        if (!this.config.model) {
            this.config.model = new Model();
        }
        if (!(this.config.model instanceof Model)) {
            switch (this.config.model) {
                case 'treemodel': {
                    this.config["model"] = new TreeModel();
                    break;
                }
                default: {
                    this.config["model"] = new Model();
                    break;
                }
            }
        }
        _this.pendingLoadOptions = { params: props.params || {} };
        //组建渲染后加载数据
        if (this.config.component) {
            let scope = this.config.component, { componentDidMount } = scope;
            this.config.component.componentDidMount = function () {
                if (utils.isFunction(componentDidMount)) {
                    utils.callback(componentDidMount, scope);
                }
                if (_this.config.autoLoad && _this.config.url) {
                    _this.flushLoad();
                }
            }
        }
    }

    /**
     * 刷新数据，和历史参数做合并查询
     * @param {*} options 
     */
    reload(options) {
        var _this = this;
        if (options) {
            if (utils.isFunction(options)) {
                options = {
                    callback: options
                };
            }
            _this.pendingLoadOptions = {
                ..._this.pendingLoadOptions,
                ...{
                    callback: null,
                },
                ...options,
                ...{
                    params: {
                        ...this.pendingLoadOptions.params,
                        ...options.params
                    }
                }
            };
        }
        _this.flushLoad();
        return this;
    }

    /**
     * 根据参数重新加载数据
     * @param {*} options 
     */
    load(options) {
        var _this = this;
        if (!options || utils.isFunction(options)) {
            options = {
                callback: options
            };
        }
        _this.pendingLoadOptions = options;
        _this.flushLoad();
        return this;
    }

    flushLoad() {
        let _this = this,
            config = this.config,
            options = this.pendingLoadOptions || { params: {} },
            url = options.url || config.url,
            listeners = config.listeners || {},
            callback = options.callback;
        if (!url) {
            console.warn("url不能为空！", this);
            utils.callback(callback, _this, [[], [], _this]);
            return;
        }
        if (utils.isFunction(listeners.onBeforeLoad)) {
            listeners.onBeforeLoad(this, options)
        }
        let option = options.option || {};
        if (options.params) option.params = options.params;
        option.callback = function(data){
            _this.data = data;
            _this.setData(data, options);
            let modelData = _this.getModelData();
            utils.callback(listeners.load, _this, [data, modelData, _this]);
            utils.callback(callback, _this, [data, modelData, _this])
        }
        request(url, option);
    }

    getData() {
        return this.config.model.getData();
    }
    getDataAt(index) {
        return this.getData()[index];
    }

    /**
     * 直接给Store赋值,并且触发datachanged事件
     * @param {Object} data 
     */
    setData(data, options = {}) {
        const { listeners = {} } = this.config;
        this.config.model.setData(data);
        let modelData = this.getModelData();
        utils.callback(listeners.datachanged, this, [data, modelData, this]);
        utils.callback(options.callback, this, [data, modelData, this]);
        return this;
    }

    removeAll(options) {
        this.setData([], options);
        return this;
    }

    getModel() {
        return this.config.model;
    }

    getModelData() {
        return this.config.model.getModelData();
    }
    getModelDataAt(index) {
        return this.getModelData()[index];
    }
}

export default Store;

