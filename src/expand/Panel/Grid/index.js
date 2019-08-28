import React, { PureComponent } from 'react';
import PageStore from '../../Data/Store/PageStore';
import Store from '../../Data/Store/Store';
import utils from '../../../utils/utils';
import { Table } from 'antd';
import treeutils from '../../utils/TreeUtils';
import styles from './index.less';

class NscGrid extends PureComponent {
    state = {
        dataSource: [],
        loading: false,
        pagination: {},
        activeIndex: -1,
        //搜索文本
        searchText: null,
        fieldOption: null,
        searchColor: null,
    }
    listeners = {
        onBeforeLoad: null,
        load: null
    }
    constructor(props) {
        super(props)
        var _this = this;
        if (props.store instanceof Store) {
            this.store = props.store;
        } else {
            var storeProps = {
                model: 'model',
                component: this,
                listeners: {
                    onBeforeLoad: function (store, options) {
                        utils.callback(_this.listeners.onBeforeLoad, _this, [store, options]);
                        _this.setState({ ..._this.state, ...{ loading: true } });
                    },
                    datachanged: function (data, modelData, store) {
                        let paging = !(_this.props.pagination === false);
                        utils.callback(_this.listeners.load, _this, [data, modelData, store, paging]);
                        if (paging) {
                            _this.setState({
                                dataSource: modelData,
                                pagination: store.getPagination(),
                                loading: false,
                                activeIndex: -1,
                            });
                        } else {
                            _this.setState({ dataSource: modelData, loading: false });
                        }
                    }
                }, ...props.store
            };
            if (props.pagination === false) {
                this.store = new Store(storeProps);
            } else {
                this.store = new PageStore(storeProps);
            }
        }
    }

    /**
     * 清除选中颜色
     */
    clearSelectColor() {
        this.setState({ activeIndex: -1 });
        return this;
    }

    onChange(pagination, filters, sorter = {}, extra) {
        let params = {
            current: pagination.current,
            size: pagination.pageSize
        };
        if (sorter.order == 'ascend') {
            params.ascs = sorter.column.field || sorter.field;
            params.descs = null;
        }
        if (sorter.order == 'descend') {
            params.descs = sorter.column.field || sorter.field;
            params.ascs = null;
        }
        this.store.reload({ params: params });
    }

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
     * 菜单搜索过滤显示
     * @param {String} val 
     */
    handleSearch(val, fieldOption, searchColor) {
        this.setState({ searchText: val, fieldOption: fieldOption, searchColor: searchColor });
    }

    render() {
        let _this = this,
            { loading, dataSource, pagination = {}, searchText, fieldOption, searchColor } = this.state,
            onChangeFn = this.props.onChange,
            props = utils.omit(this.props, ['store', 'onChange'], { rowKey: 'id', clickChangeColor: false });
        if (props.pagination !== false) {
            props.pagination = {
                showSizeChanger: true,
                showQuickJumper: true,
                ...props.pagination,
                ...pagination
            }
            if (props.showTotal == true) {
                props.pagination.showTotal = function (total, [from, to]) {
                    return '显示 ' + from + ' - ' + to + '条，共 ' + total + ' 条';
                }
            }
        }
        props.onChange = function (pagination, filters, sorter, extra) {
            _this.onChange(pagination, filters, sorter, extra);
            utils.callback(onChangeFn, _this, [pagination, filters, sorter, extra]);
        }
        if (props.clickChangeColor) {
            const onRowFn = props.onRow;
            props.onRow = function (record, index) {
                var custom = onRowFn ? onRowFn(record, index) : {};
                const onClickFn = custom.onClick;
                custom.onClick = (event) => {
                    _this.setState({
                        activeIndex: index//获取点击行的索引
                    })
                    utils.callback(onClickFn, _this, [event]);
                }
                return custom;
            }
            props.rowClassName = function (record, index) {
                return index === _this.state.activeIndex ? `${styles.clickRowStyle}` : "";
            }
        }
        let newDataSource = [];
        if (searchText) {
            const data = treeutils.getSearchMenuDatas(this, searchText, fieldOption, searchColor);
            newDataSource = data.treeDatas;
            props.expandedRowKeys = data.openKeys;
        } else {
            newDataSource = dataSource;
        }
        return (
            <div>
                <Table
                    childrenColumnName="childNodes"
                    dataSource={newDataSource}
                    loading={loading}
                    // size="middle"
                    {...props}
                />
            </div>
        );
    }
}

export default NscGrid;