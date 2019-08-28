import React from 'react';
import { Checkbox } from "antd";
import NscFormItem from './Item'
class NscFormCheckbox extends NscFormItem {

    updateDecoratorProps(decoratorProps) {
        decoratorProps.valuePropName = "checked";
        return decoratorProps;
    }

    getFieldComponent(fieldProps) {
        return <Checkbox {...fieldProps} />
    }
}

export default NscFormCheckbox;