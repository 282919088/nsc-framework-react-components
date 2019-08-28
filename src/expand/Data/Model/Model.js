import NodeInterface from '../Node/NodeInterface';
import cloneDeep from 'lodash/cloneDeep';
class Model {
    config = {
        //数据字段
        fields: undefined,
        //数据存储
        data: null,
    }

    constructor(props) {
        this.config = { ...this.config, ...props };
        let data = this.config.data;
        if (data && !(data instanceof NodeInterface)) {
            this.config.data = this._createNodeInterface(data);
        }
    }

    /**
     * 设置数据
     * @param {Object[]} data 
     */
    setData(data) {
        var _this = this, config = this.config;
        this.config.data = this._createNodeInterface(data);
        return this;
    }

    /**
     * 获取校验字段属性  
     */
    getFields() {
        return this.config.fields;
    }

    _createNodeInterface(data = []) {
        let _this = this;
        if (!Array.isArray(data)) {
            data = [data];
        }
        let parentId = '-1', parentIds = {};
        data.forEach(item => {
            parentIds[item.parentId] = item;
        })
        if (Object.keys(parentIds).length == 1) parentId = data[0].parentId;
        let rootData = { id: parentId, key: 'root', title: 'root', children: data };
        return new NodeInterface({ data: rootData, fields: _this.config.fields });
    }

    /**
     * 获取模型中的实际数据
     */
    getData() {
        var _this = this, config = this.config;
        var modelDatas = this.getModelData();
        let ecahFn = function (items) {
            var datas = [];
            items.forEach(currentItem => {
                var data = currentItem.get("attribute");
                if (currentItem.childNodes) {
                    data['children'] = ecahFn(currentItem.childNodes);
                }
                datas.push(data);
            });
            return datas;
        }
        return ecahFn(modelDatas);
    }

    /**
     * 获取Root节点对象
     */
    getRoot() {
        return this.config.data;
    }

    getModelData() {
        let modeldata = this.config.data.childNodes;
        return modeldata ? modeldata : [];
    }

    getCloneModelData() {
        return this._createNodeInterface(cloneDeep(this.getData())).childNodes;
    }
}
export default Model;