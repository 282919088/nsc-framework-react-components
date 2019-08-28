import React from 'react';
import { DatePicker } from "antd";
const { RangePicker } = DatePicker;
import NscFormItem from './Item'
class NscFormRangePicker extends NscFormItem {
    
    getFieldComponent(fieldProps) {
        return <RangePicker {...fieldProps} />
    }
}

export default NscFormRangePicker;