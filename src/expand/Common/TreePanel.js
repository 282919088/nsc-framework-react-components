import React, { PureComponent } from 'react';
import treeutils from '../utils/TreeUtils';
import TreeStore from '../Data/Store/TreeStore';
import utils from '../../utils/utils';
import 'antd/es/tree/style';

class TreePanel extends PureComponent {
    state = {
        //搜索文本
        searchText: null,
        fieldOption: null,
        searchColor: null,

        loading: false,
        treeDatas: [],
        checkedKeys: []
    }


    constructor(props) {
        super(props)
        var _this = this;
        if (props.store instanceof TreeStore) {
            this.store = props.store;
        } else {
            var props = {
                component: this,
                model: 'treemodel',
                listeners: {
                    onBeforeLoad: function () {
                        let loading = props.lazyload != true;
                        _this.setState({ ..._this.state, ...{ loading: loading } });
                    },
                    datachanged: function (data, modelData) {
                        _this.setState({ treeDatas: modelData, checkedKeys: _this._dataToCheckedKeys(modelData), loading: false });
                    }
                },
                ...props.store
            };
            this.store = new TreeStore(props);
        }
    }

    /**
     * 初始化节点选中
     * @param {*} modelData  数据
     */
    _dataToCheckedKeys(modelData) {
        return [];
    }

    /**
     * 界面渲染
     */
    renderTemplate(treeProps, newTreeDatas) {

    }

    render() {
        const { searchText, treeDatas, checkedKeys, fieldOption, searchColor } = this.state,
            treeProps = utils.omit(this.props, ['store'], { checkedKeys: checkedKeys });
        let newTreeDatas = [];
        if (searchText) {
            const data = treeutils.getSearchMenuDatas(this, searchText, fieldOption, searchColor);
            newTreeDatas = data.treeDatas;
            treeProps.openKeys = data.openKeys;
        } else {
            newTreeDatas = treeDatas;
        }
        return (
            this.renderTemplate(treeProps, newTreeDatas)
        );
    }

    /**
     * 获取数据对象
     */
    getStore() {
        return this.store;
    }

    /**
     * 获取数据模型对象
     */
    getModel() {
        return this.store.getModel();
    }

    /**
     *  刷新界面
     * @param {Object} options 参数
     */
    reload(options) {
        this.store.reload(options);
        return this;
    }

    /**
     * 菜单搜索过滤显示
     * @param {String} val 
     */
    handleSearch(val, fieldOption, searchColor) {
        this.setState({ searchText: val, fieldOption: fieldOption, searchColor: searchColor });
    }
}

export default TreePanel;
