import React, { Component } from 'react';
import { Cascader } from 'antd';
import utils from '../../../utils/utils';
import Store from '../../Data/Store/Store';
import treeutils from '../../utils/TreeUtils';

class NscCascader extends Component {

    state = {
        dataSource: []
    }

    config = {
        //面包屑数据
        breadcrumbMap: {}
    }

    listeners = {
        onBeforeLoad: null,
        load: null
    }

    constructor(props) {
        super(props);
        const _this = this;
        const { url } = props;
        if (!url) throw new Error('url不能都为空！');
        var storeProps = {
            model: 'model',
            component: this,
            autoLoad: true,
            url: url,
            listeners: {
                onBeforeLoad: function (store, options) {
                    utils.callback(_this.listeners.onBeforeLoad, _this, [store, options]);
                },
                datachanged: function (data, modelData, store) {
                    _this.config.breadcrumbMap = treeutils.getBreadcrumbMap(modelData);
                    _this.setState({ dataSource: modelData });
                }
            },
            ...props.store
        };
        this.store = new Store(storeProps);
    }

    componentDidMount() {
        if (this.props.data) {
            this.store.setData(this.props.data);
        }
    }

    render() {
        const { dataSource } = this.state;
        const { value } = this.props;
        const props = {
            options: dataSource,
            placeholder: "请选择",
            allowClear: true,
            showSearch: true,
            expandTrigger: 'click',  //子级展开方式 'click' 和 'hover'
            changeOnSelect: false, //允许不选择末级
            labelField : null, //显示的字段
            valueField : null, //值字段
            fieldNames: { label: 'title', value: 'id', children: 'childNodes' },
            ...this.props,
        };
        if(props.labelField)props.fieldNames.label = props.labelField;
        if(props.valueField)props.fieldNames.value = props.valueField;
        delete props.labelField;
        delete props.valueField;
        if(!utils.isArray(value)){
            props.value = [];
            let map = this.config.breadcrumbMap[String(value)];
            if (map) props.value = map.paths;
        }
        return (
            <Cascader {...props} />
        )
    }
}

export default NscCascader;
