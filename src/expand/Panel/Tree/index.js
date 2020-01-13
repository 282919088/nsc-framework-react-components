import React from 'react';
import { Tree, Spin } from 'antd';
import TreePanel from '../../Common/TreePanel';
import utils from '../../../utils/utils';
const { TreeNode } = Tree;

class NscTree extends TreePanel {

    _dataToCheckedKeys(modelData) {
        let checkedKeys = { checked: [], halfChecked: [] };
        utils.forEachTree(modelData, function (node) {
            if (node.checked == true) {
                checkedKeys.checked.push(node.id);
            }
        })
        return checkedKeys;
    }

    /**
     * 获取选中节点ID数组
     * @return String[]
     */
    getCheckedKeys() {
        const { checkedKeys, halfCheckedKeys } = this.refs.nsctree.tree.state;
        return checkedKeys;
    }

    /**
     * 获取选中节点对象数组
     * @return node[]
     */
    getCheckedNodes() {
        const { checkedKeys, keyEntities } = this.refs.nsctree.tree.state;
        let nodes = [];
        checkedKeys.map(key => {
            nodes.push(keyEntities[key].node.props.dataref);
        })
        return nodes;
    }

    /**
     * 获取全部选中节点ID，包含半选中节点ID
     * @return String[]
     */
    getCheckedAllKeys() {
        const { checkedKeys, halfCheckedKeys } = this.refs.nsctree.tree.state;
        return checkedKeys.concat(halfCheckedKeys);
    }

    /**
     * 获取全部选中节点Node对象，包含半选中节点Node对象
     * @return node[]
     */
    getCheckedAllNodes() {
        const { checkedKeys, halfCheckedKeys, keyEntities } = this.refs.nsctree.tree.state;
        let checkedKeysAll = checkedKeys.concat(halfCheckedKeys);
        let nodes = [];
        checkedKeysAll.map(key => {
            nodes.push(keyEntities[key].node.props.dataref);
        })
        return nodes;
    }

    _onLoadData = treeNode => new Promise((resolve) => {
        const _this = this, node = treeNode.props.dataref;
        this.store.lazyLoad(node, function () {
            resolve();
            _this.forceUpdate();
        });
    })

    renderTemplate(props = {}, newMenuDatas = []) {
        var _this = this;
        if (props.checkPropagation) {
            props.checkStrictly = true;
        }
        if (props.showIcon == null) {
            props.showIcon = true;
        }
        if (props.openKeys) {
            // props.expandedKeys = props.openKeys;
            // console.log("openKeys",props.openKeys)
        }
        let { lazyload } = this.store.config;
        if (lazyload) {
            props.loadData = this._onLoadData;
        }
        const onCheckFn = props.onCheck;
        props.onCheck = function (checkedKeys, e) {
            _this.setState({ checkedKeys: checkedKeys });
            utils.callback(onCheckFn, _this, [checkedKeys, e]);
        }
        return (
            <Spin spinning={this.state.loading} >
                <Tree {...props} ref="nsctree">
                    {this.renderTreeNodes(newMenuDatas, props.renderTreeNode)}
                </Tree>
            </Spin>
        );
    }

    renderTreeNodes = (data, renderFn) => data.map((item) => {
        var props = {}
        item.config.fields.forEach((field) => {
            props[field.name] = item[field.name];
        })
        if (renderFn) {
            props = utils.callback(renderFn, this, [props, item]);
        }
        if (item.childNodes) {
            return (
                <TreeNode {...props} dataref={item}>
                    {this.renderTreeNodes(item.childNodes, renderFn)}
                </TreeNode>
            );
        }
        return <TreeNode {...props} dataref={item} />;
    })
}

export default NscTree;
