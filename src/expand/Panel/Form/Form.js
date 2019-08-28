import React, { PureComponent } from 'react';
import { Form } from "antd";
import omit from 'omit.js';
import utils from '../../../utils/utils';

class NscForm extends PureComponent {
    
    constructor(props) {
        super(props);
        this.config = props;
    }

    cloneElement(form, item, index = 0) {
        if (utils.isString(item)) return item;
        let _this = this, props = { key: index };
        if (item.type && item.type.name ) { //&& item.type.name.indexOf('Nsc') == 0
            props.form = form;
        }
        if (item.props && item.props.children) {
            props.children = React.Children.map(item.props.children, function (child, index) {
                return _this.cloneElement(form, child, index);
            });
        }
        return React.cloneElement(item, props);
    }

    render() {
        const _this = this, { form, children } = this.props;
        const newChildren = React.Children.map(children, function (child, index) {
            return _this.cloneElement(form, child, index);
        });
        const props = omit(this.props, ['form']);
        return (
            <Form {...props}>{newChildren}</Form>
        )
    }
}
export default Form.create()(NscForm);