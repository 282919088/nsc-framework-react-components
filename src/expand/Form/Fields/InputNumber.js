import React from 'react';
import { InputNumber } from "antd";
import NscFormItem from './Item'
class NscFormInputNumber extends NscFormItem {

    getFieldComponent(fieldProps) {
        return <InputNumber {...fieldProps} />
    }
}

export default NscFormInputNumber;