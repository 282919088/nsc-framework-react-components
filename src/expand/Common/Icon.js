import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import utils from '../../utils/utils';

class NscIcon extends PureComponent {
    state = {
        spin: false,
    }

    setLoading(v) {
        this.setState({ spin: v });
    }

    render() {
        const _this = this;
        const props = {
            ...this.props,
            ...this.state,
        };
        const clickFn = props.onClick;
        props.onClick = function (e) {
            if (props.spin) return;
            utils.callback(clickFn, this, [e])
        }
        return (
            <Icon {...props}></Icon>
        )
    }
}
export default NscIcon;