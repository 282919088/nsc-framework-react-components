import React from 'react';
import { DatePicker } from "antd";
const { MonthPicker} = DatePicker;
import NscFormItem from './Item'
class NscFormMonthPicker extends NscFormItem {
    
    getFieldComponent(fieldProps) {
        return <MonthPicker {...fieldProps} />
    }
}

export default NscFormMonthPicker;