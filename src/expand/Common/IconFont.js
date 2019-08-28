import React from 'react';
import { Icon } from 'antd';
import config from '../../config'
let { iconfontUrl } = config();
const IconFont = Icon.createFromIconfontCN({
    scriptUrl: iconfontUrl,
});
export default IconFont;