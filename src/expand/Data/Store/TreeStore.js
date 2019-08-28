import Store from './Store';
import utils from '../../../utils/utils';

class TreeStore extends Store {

    setData(data, options = {}) {
        const { listeners = {} } = this.config;
        if (options.lazyLoad) {
            let node = options.node;
            node.setChildren(data);
            let modelData = this.getModelData();
            utils.callback(listeners.datachanged,this,[data, modelData, this]);
            utils.callback(options.callback,this,[data, modelData, this]);
        } else {
            super.setData(data);
        }
    }

    lazyLoad(node, fn) {
        this.load({
            lazyLoad: true, node: node, params: { id: node.get("key"), type: node.get("type") }, callback: function () {
                utils.callback(fn, this, [node]);
            }
        });
    }
}

export default TreeStore;