import React from 'react';
import { Input } from "antd";
import NscFormItem from './Item'
class NscFormTextArea extends NscFormItem {
    
    getFieldComponent(fieldProps) {
        return <Input.TextArea {...fieldProps} />
    }
}

export default NscFormTextArea;