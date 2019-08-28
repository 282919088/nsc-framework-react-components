import React from 'react';
import { DatePicker } from "antd";
import NscFormItem from './Item'
class NscFormDatePicker extends NscFormItem {
    
    getFieldComponent(fieldProps) {
        return <DatePicker {...fieldProps} />
    }
}

export default NscFormDatePicker;