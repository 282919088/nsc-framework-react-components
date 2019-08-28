import React from 'react';
import NscFormItem from './Item'
import NscCascader from '../Cascader';
class NscFormCascader extends NscFormItem {

    getFieldComponent(fieldProps) {
        return <NscCascader {...fieldProps} />
    }
}

export default NscFormCascader;