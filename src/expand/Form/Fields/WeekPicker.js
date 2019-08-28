import React from 'react';
import { DatePicker } from "antd";
const { WeekPicker} = DatePicker;
import NscFormItem from './Item'
class NscFormWeekPicker extends NscFormItem {
    
    getFieldComponent(fieldProps) {
        return <WeekPicker {...fieldProps} />
    }
}

export default NscFormWeekPicker;