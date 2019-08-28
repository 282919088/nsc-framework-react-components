import React, { PureComponent } from 'react';
import { Form } from "antd";
import omit from 'omit.js';
const FormItem = Form.Item;
class NscFormItem extends PureComponent {
    
    /**
     * 修改Item属性
     */
    updateItemProps(itemProps) {
        return itemProps;
    }
    /**
     * 修改Decorator属性
     */
    updateDecoratorProps(decoratorProps) {
        return decoratorProps;
    }

    /**
     * 自定义渲染组件
     */
    getFieldComponent(itemProps, props) {
        return <div></div>;
    }
    render() {
        let {
            //字段标题
            label,
            //字段唯一标识，field取值的key
            name,

            //是否必填
            required,
            //如果不填提示文字
            message,
            //校验规则，缺省string https://github.com/yiminghe/async-validator#type
            type = "string",

            //初始化值
            initialValue,
            //子节点的值的属性
            valuePropName = 'value',
            //FormItem属性
            itemProps = {},
            //表单验证对象属性
            decoratorProps = {},
            //组件渲染
            getFieldComponent = this.getFieldComponent
        } = this.props;
        const { getFieldDecorator } = this.props.form;
        itemProps = {
            ...{
                label: label
            },
            ...itemProps
        }
        decoratorProps = {
            ...{
                type: type,
                rules: [],
                initialValue: initialValue,
                valuePropName: valuePropName,
            },
            ...decoratorProps
        }
        if (required) {
            decoratorProps.rules.push({
                required: required,
                message: message || (label + '不能为空！'),
            });
        }
        itemProps = this.updateItemProps(itemProps);
        decoratorProps = this.updateDecoratorProps(decoratorProps);
        let fieldProps = omit(this.props, ['formobj', 'itemProps', 'decoratorProps', 'label', 'required', 'message', 'type', 'initialValue', 'valuePropName']);
        return (
            <FormItem {...itemProps}>
                {getFieldDecorator(name, decoratorProps)(
                    getFieldComponent(fieldProps, this.props)
                )}
            </FormItem>
        )
    }
}

export default NscFormItem;