import isEqual from 'lodash/isEqual';

/**
 * 获取面包屑映射
 * {
 *    key1:{paths:['key1'],title:'系统管理'}
 *    key2:{paths:['key1','key2'],title:'功能配置'}
 *    key3:{paths:['key1','key2','key3'],title:'菜单管理',path:'/platform/menu'}
 * }
 * @param {object[]} menusDatas  树形结构数据
 * @param {Object} fieldOption  关键字段名称，缺省{ keyField: 'key', titleField: 'title',pathsField:'paths' }
 * @returns {Map} 
 */
export function getBreadcrumbMap(menuDatas, fieldOption = { keyField: 'key', titleField: 'title', pathsField: "paths" }) {
    const titleMap = {};
    const flattenMenuData = (data, paths = []) => {
        data.forEach(menuItem => {
            menuItem.set(fieldOption.pathsField, paths.concat(menuItem.get(fieldOption.keyField)));
            if (menuItem.childNodes) {
                flattenMenuData(menuItem.childNodes, menuItem.get(fieldOption.pathsField));
            }
            if (menuItem.get(fieldOption.keyField)) {
                titleMap[menuItem.get(fieldOption.keyField)] = menuItem;
            }
        });
    };
    flattenMenuData(menuDatas);
    return titleMap;
}

/**
 * 判断菜单Map对象中符合条件的对象
 *    key1:{paths:['key1'],title:'系统管理'}
 *    key2:{paths:['key1','key2'],title:'功能配置'}
 *    key3:{paths:['key1','key2','key3'],title:'菜单管理',path:'/platform/menu'}
 * 搜索《管理》后返回 
 *    {key1:'key1',key2:'key2',key3:'key3'}
 * @param {Map<String,Object>} breadcrumbMap  菜单面包屑
 * @param { String } searchText  搜索内容
 * @param {Object} fieldOption  关键字段名称，缺省{ keyField: 'key', titleField: 'title',pathsField:'paths' }
 * @returns {Map<String,String>}
 */
export function getEffectiveNodeKeys(breadcrumbMap, searchText, fieldOption = { keyField: 'key', titleField: 'title', pathsField: "paths" }) {
    const keys = {};
    Object.keys(breadcrumbMap).forEach((key, i) => {
        const item = breadcrumbMap[key];
        if (String(item.get(fieldOption.titleField)).indexOf(searchText) != -1) {
            item.get(fieldOption.pathsField).map((v) => {
                keys[v] = v;
            })
        }
    });
    return keys;
}

/**
 * 获取过滤后显示的菜单数据
 * @param {Object[]} menusDatas  树形结构数据
 * @param {String[]} keys  有效的菜单节点
 * @param {String} searchText  搜索内容，非必填
 * @param {Object} fieldOption  关键字段名称，缺省{ keyField: 'key', titleField: 'title',pathsField:'paths' }
 * @param {String} color   搜索内容重点颜色标识，非必填，缺省red
 */
export function getEffectiveMenuDatas(menusDatas, keys, searchText, fieldOption = { keyField: 'key', titleField: 'title', pathsField: "paths" }, color = "red") {
    const newMenusDatas = [];
    const flattenMenuData = (data) => {
        for (var i = 0; i < data.length; i++) {
            const item = data[i];
            const isExist = keys[item.get(fieldOption.keyField)] != null;
            const title = String(item.get(fieldOption.titleField));
            if (!isExist) {
                data.splice(i, 1); // 将使后面的元素依次前移，数组长度减1
                i--; // 如果不减，将漏掉一个元素
            } else if (searchText && title.indexOf(searchText) != -1) {
                const startIndex = title.indexOf(searchText);
                const endIndex = startIndex + searchText.length;
                const before = title.substring(0, startIndex);
                const after = title.substring(endIndex, title.length);
                const match = (<font color={color}>{searchText}</font>);
                item.set(fieldOption.titleField, (
                    <span>
                        {before}
                        <font>{match}</font>
                        {after}
                    </span>
                ));
            };
            if (isExist && item.childNodes) {
                flattenMenuData(item.childNodes);
            }
        }
    };
    flattenMenuData(menusDatas);
    return menusDatas;
}

/**
 * 搜索菜单数据，移除不符合的菜单和不需要的目录结构，缺省符合内容标红
 * @param {Object} thiz  menu菜单对象，缓存时候存储数据使用
 * @param {String} searchText  搜索内容
 * @param {Object} fieldOption  关键字段名称，缺省{ keyField: 'key', titleField: 'title',pathsField:'paths' }
 * @param {String} color   搜索内容重点颜色标识，非必填，缺省red,当false时候，且不重点标注颜色
 * @param {String} cachekey   缓存数据存储key，缺省nsc_menu_cache
 * @returns {*} {openKeys:{},treeDatas:[]} 
 */
export function getSearchMenuDatas(thiz, searchText, fieldOption = { keyField: 'key', titleField: 'title', pathsField: "paths" }, color = "red", cachekey = "nsc_menu_cache") {
    let breadcrumbMap = {}, menusDatas = thiz.getModel().getCloneModelData();
    if (thiz) {
        if (!thiz[cachekey]) thiz[cachekey] = {};
        if (!isEqual(menusDatas, thiz[cachekey].treeDatas)) {
            thiz[cachekey].breadcrumbMap = breadcrumbMap = getBreadcrumbMap(menusDatas, fieldOption);
            thiz[cachekey].treeDatas = menusDatas;
        } else {
            breadcrumbMap = thiz[cachekey].breadcrumbMap;
        }
    } else {
        breadcrumbMap = getBreadcrumbMap(menusDatas, fieldOption);
    }
    const keys = getEffectiveNodeKeys(breadcrumbMap, searchText, fieldOption);
    const datas = getEffectiveMenuDatas(menusDatas, keys, color ? searchText : null, fieldOption, color);
    let openKeys = [];
    Object.keys(keys).forEach((key, i) => {
        openKeys.push(key);
    });
    return {
        openKeys: openKeys,
        treeDatas: datas
    };
}

export default {
    getBreadcrumbMap,
    getEffectiveNodeKeys,
    getEffectiveMenuDatas,
    getSearchMenuDatas
}