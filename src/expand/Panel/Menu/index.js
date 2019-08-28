import React from 'react';
import { Menu } from 'antd';
import utils from '../../../utils/utils';
import TreePanel from '../../Common/TreePanel';
const SubMenu = Menu.SubMenu;

class NscMenu extends TreePanel {

    /**
     * 获得菜单子节点
     * @memberof SiderMenu
     */
    getNavMenuItems(menusData) {
        if (!menusData || !Array.isArray(menusData)) {
            return [];
        }
        return menusData
            .filter(item => item.key)
            .map(item => this.getSubMenuOrItem(item))
            .filter(item => item);
    };

    getSubMenuOrItem(item) {
        const { key, style, title, childNodes, icon } = item;
        const spantitle = (<span style={style}>{title}</span>);
        if (childNodes && childNodes.length > 0) {
            return (
                <SubMenu
                    key={key}
                    dataref={item}
                    title={icon ? (<span>{utils.getIcon(icon)}{spantitle}</span>) : (spantitle)}
                >
                    {this.getNavMenuItems(childNodes)}
                </SubMenu>
            );
        }
        return <Menu.Item key={key} dataref={item}>{icon ? (<span>{utils.getIcon(icon)}{spantitle}</span>) : (spantitle)}</Menu.Item>;
    };

    renderTemplate(props = {}, newMenuDatas = []) {
        return (
            <Menu
                mode="inline"
                ref="nscmenu"
                {...props}
            >
                {this.getNavMenuItems(newMenuDatas)}
            </Menu>
        );
    }
}

export default NscMenu;
