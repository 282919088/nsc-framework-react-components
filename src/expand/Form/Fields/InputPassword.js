import React from 'react';
import { Input } from "antd";
import NscFormItem from './Item'
class NscFormInputPassword extends NscFormItem {
    
    getFieldComponent(fieldProps) {
        return <Input.Password {...fieldProps} />
    }
}

export default NscFormInputPassword;