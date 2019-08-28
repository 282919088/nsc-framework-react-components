import React from 'react';
import { Input } from "antd";
import NscFormItem from './Item'
class NscFormInput extends NscFormItem {
    
    getFieldComponent(fieldProps) {
        return <Input {...fieldProps} />
    }
}

export default NscFormInput;