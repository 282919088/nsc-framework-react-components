import React from 'react';
import NscFormItem from './Item'
import NscSelect from '../Select';
class NscFormSelect extends NscFormItem {

    getFieldComponent(fieldProps) {
        return <NscSelect {...fieldProps} />
    }
}

export default NscFormSelect;