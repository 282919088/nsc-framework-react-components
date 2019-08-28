import Model from './Model';
import { getIcon } from '../../../utils/utils';

var config = {
    //数据字段
    fields: [
        //主键
        { name: 'key', type: 'string' },
        //	标题
        { name: 'title', type: 'string' },
        //自定义图标
        {
            name: 'icon', type: 'string', defaultValue: '', convert: function (value, node) {
                if (value) return getIcon(value);
                return getIcon(node.childNodes ? 'folder' : 'file');
            }
        },
        //设置节点是否可被onclick事件点击选中
        { name: 'selectable', type: 'boolean', defaultValue: true, convert: null },
        //设置为叶子节点
        { name: 'isLeaf', type: 'boolean', defaultValue: false, convert: null },
        //禁掉响应
        { name: 'disabled', type: 'boolean', defaultValue: false },
        //禁掉 checkbox
        { name: 'disableCheckbox', type: 'boolean', defaultValue: false },
        //======================扩展属性=============
        //父节点ID
        { name: 'parentId', type: 'string', defaultValue: null },
        { name: 'cls', type: 'string', defaultValue: '', convert: null },
        { name: 'iconCls', type: 'string', defaultValue: '', convert: null },
        //是否展开
        { name: 'expanded', type: 'bool', defaultValue: false, convert: null },
        //checkbox是否选中状态
        { name: 'checked', type: 'boolean', defaultValue: false },
        //备注信息
        { name: 'description', type: 'string', defaultValue: '', convert: null },
    ]
}

class TreeModel extends Model {
    constructor(props) {
        super({ ...config, ...props });
    }
}

export default TreeModel;