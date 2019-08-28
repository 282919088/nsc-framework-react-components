import React from 'react';
import { Switch } from "antd";
import NscFormItem from './Item'
class NscFormInput extends NscFormItem {

    updateDecoratorProps(decoratorProps){
        decoratorProps.valuePropName = "checked";
        return decoratorProps;
    }
    
    getFieldComponent(fieldProps) {
        return <Switch {...fieldProps} />
    }
}

export default NscFormInput;