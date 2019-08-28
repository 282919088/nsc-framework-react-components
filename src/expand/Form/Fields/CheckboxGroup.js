import React from 'react';
import { Checkbox } from "antd";
import NscFormItem from './Item'
class NscFormCheckboxGroup extends NscFormItem {

    getFieldComponent(fieldProps) {
        return <Checkbox.Group {...fieldProps} />
    }
}

export default NscFormCheckboxGroup;