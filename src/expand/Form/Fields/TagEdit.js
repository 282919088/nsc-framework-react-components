import React from 'react';
import NscFormItem from './Item'
import TagEdit from '../TagEdit';
class NscFormTagEdit extends NscFormItem {

    getFieldComponent(fieldProps) {
        return <TagEdit {...fieldProps} />
    }
}

export default NscFormTagEdit;