import React from 'react';
import NscFormItem from './Item'
import TagSelect from '../TagSelect';
class NscFormTagSelect extends NscFormItem {

    getFieldComponent(fieldProps) {
        return <TagSelect {...fieldProps} />
    }
}

export default NscFormTagSelect;