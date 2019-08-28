import React from 'react';
import { Radio } from "antd";
import NscFormItem from './Item'
class NscFormGroupRadio extends NscFormItem {

    getFieldComponent(fieldProps,props) {
        const { data } = fieldProps;
        return (
            <Radio.Group {...fieldProps}>
                {
                    data.map((item, index) => {
                        return (
                            <Radio {...item.RadioProps} key={item.value} value={item.value}>{item.title}</Radio>
                        )
                    })
                }
            </Radio.Group>
        )
    }
}

export default NscFormGroupRadio;