import { getFieldValue } from '../../../utils/utils';
import cloneDeep from 'lodash/cloneDeep';
class NodeInterface {

    //上级节点
    parentNode = null;
    //子节点
    childNodes = null;

    constructor(props) {
        let { data, parentNode } = props;
        this.config = { ...this.config, ...props };
        this._decorate(data, parentNode);
    }

    _decorate(data, parentNode) {
        var _this = this, children = data.children;
        delete data.children;
        const key = String(data.id || data.key);
        _this.attribute = data;
        _this.set('id', key).set('key', key)
        if (Array.isArray(this.config.fields)) {
            this.config.fields.forEach(field => {
                let value = data[field.name];
                _this.set(field.name, getFieldValue(value, data, field));
            })
        } else {
            Object.keys(data).forEach(key => {
                _this.set(key, data[key]);
            })
        }
        if (parentNode) {
            _this.parentNode = parentNode;
            _this.set('parentId', parentNode.get("id"));
        }
        if (children) {
            this.setChildren(this._flattenNodeData(children, this));
        }
    }

    set(key, obj) {
        this[key] = obj;
        if (this.attribute.hasOwnProperty(key)) {
            this.attribute[key] = obj;
        }
        return this;
    }

    get(key) {
        return this[key];
    }

    _flattenNodeData(datas, parentNode) {
        let treeNodes = [];
        datas.forEach(item => {
            let node = this._createNodeInterface(item, parentNode);
            treeNodes.push(node);
        });
        return treeNodes;
    }

    _createNodeInterface(data, parentNode) {
        return new NodeInterface({ data: data, parentNode: parentNode, fields: this.config.fields });
    }

    /**
     * 批量添加子节点
     * @param {Array} childNodes 
     */
    setChildren(childNodes) {
        let _this = this, treeNodes = [];
        childNodes.forEach(item => {
            if (item instanceof NodeInterface) {
                treeNodes.push(item);
            } else {
                let node = this._createNodeInterface(item, _this)
                treeNodes.push(node);
            }
        })
        _this.isLeaf = false;
        return _this['childNodes'] = treeNodes;
    }

    /**
     *  同级目录下创建一个新节点
     * @param {Object} node 节点信息
     */
    createNode(node) {
        let newNode = this._createNodeInterface(node, this.parentNode)
        this.parentNode.children.push(newNode);
        return newNode;
    }

    /**
     * 插入节点作为此节点的最后一个子节点。
     * @param {Object} node 节点信息
     */
    appendChild(node, index = 0) {
        this.childNodes = this.childNodes || [];
        this.isLeaf = false;
        node.isLeaf = true;
        let newNode = this._createNodeInterface(node, this);
        this.childNodes.splice(index, 0, newNode);
        return newNode;
    }

    /**
     * 插入新节点，插入当前节点之前
     * @param {*} node
     */
    insertBefore(node) {
        let childNodes = this.parentNode.childNodes;
        const index = childNodes.indexOf(this);
        let newNode = this._createNodeInterface(node, this.parentNode)
        childNodes.splice(index, 0, newNode);
        return newNode;
    }

    /**
     * 插入新节点，插入当前节点之后
     * @param {*} node 
     */
    insertAfter(node) {
        let childNodes = this.parentNode.childNodes;
        const index = childNodes.indexOf(this) + 1;
        let newNode = this._createNodeInterface(node, this.parentNode)
        childNodes.splice(index, 0, newNode);
        return newNode;
    }

    /**
     * 删除当前节点
     */
    remove() {
        let childNodes = this.parentNode.childNodes;
        const index = childNodes.indexOf(this);
        childNodes.splice(index, 1);
        if (childNodes.length == 0) {
            this.parentNode.isLeaf = true;
        }
    }

    /**
     * 从此节点中删除子节点。
     * @param {Object} node  节点信息
     */
    removeChild(node) {
        let childNodes = this.childNodes;
        const index = childNodes.indexOf(node);
        childNodes.splice(index, 1);
        if (childNodes.length == 0) {
            this.isLeaf = true;
        }
        return this;
    }

    /**
     * 删除全部子节点
     */
    removeAll() {
        if (this.childNodes) {
            this.childNodes.length = 0;
        }
        this.isLeaf = true;
        return this;
    }

    /**
     * 获取全部子节点ID
     */
    getChildNodeIds() {
        let ids = [];
        this.childNodes.forEach(item => {
            ids.push(item.id);
        })
        return ids;
    }

    /**
     * 获取兄弟节点
     */
    getSiblings() {
        return this.parentNode.childNodes;
    }

    /**
     * 当前节点是否末级
     * @return {Boolean}
     */
    isLeaf() {
        return this['isLeaf'];
    }

    /**
     * 克隆当前节点
     */
    clone() {
        return this._createNodeInterface(cloneDeep(this.attribute),this.parentNode);
    }

    /**
     * A元素移动到B元素的位置
     * @param {*} dragNode 
     * @param {*} targetNode 
     */
    moveArray(dragNode, targetNode) {
        //同级移动
        if(dragNode.parentNode == targetNode.parentNode){
            let childNodes = dragNode.parentNode.childNodes;
            const index1 = childNodes.indexOf(dragNode);
            const index2 = childNodes.indexOf(targetNode);
            childNodes.splice(index1, 1)
            childNodes.splice(index2, 0, dragNode);
        }else{
            let childNodes = targetNode.parentNode.childNodes;
            const index2 = childNodes.indexOf(targetNode);
            dragNode.remove();
            dragNode.parentNode = targetNode.parentNode;
            dragNode.set("parentId",targetNode.get("parentId"))
            childNodes.splice(index2, 0, dragNode);
        }
    }
}

export default NodeInterface;