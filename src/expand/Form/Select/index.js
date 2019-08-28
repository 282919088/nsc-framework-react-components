import React, { PureComponent } from 'react';
import { Select } from 'antd';
import utils from '../../../utils/utils';
import Store from '../../Data/Store/Store';
const { Option, OptGroup } = Select;

class NscSelect extends PureComponent {

    state = {
        dataSource: []
    }

    listeners = {
        onBeforeLoad: null,
        load: null
    }
    constructor(props) {
        super(props);
        const _this = this;
        const { viewname, codes, data, url ,params } = props;
        if (!(data || viewname || url)) {
            throw new Error('url、viewname、data不能都为空！');
        }
        var storeProps = {
            model: 'model',
            component: this,
            listeners: {
                onBeforeLoad: function (store, options) {
                    utils.callback(_this.listeners.onBeforeLoad, _this, [store, options]);
                },
                datachanged: function (data, modelData, store) {
                    _this.setState({ dataSource: modelData });
                }
            },
            ...props.store
        };
        if ((viewname || url) && data==null) {
            storeProps = {
                ...{
                    autoLoad: true,
                    url: url || ('/api/admin/platform/viewlist/' + viewname),
                    params: params || { codes: codes },
                },
                ...storeProps,
            }
        }
        this.store = new Store(storeProps);
    }

    componentDidMount() {
        if (this.props.data) {
            this.store.setData(this.props.data);
        }
    }

    renderOption(optionData) {
        return optionData.map(item => {
            return (
                <Option key={item.id || item.value} value={item.value} title={item.title}>{item.title}</Option>
            )
        })
    }

    render() {
        const { dataSource } = this.state;
        let optGroupData = {}, optionData = [];
        dataSource.forEach((item) => {
            let label = item.groupName;
            if (label) {
                if (!optGroupData[label]) optGroupData[label] = [];
                optGroupData[label].push(item);
            } else {
                optionData.push(item);
            }
        })
        let option = this.renderOption(optionData);
        let optGroup = Object.keys(optGroupData).map(key => {
            return (
                <OptGroup key={key} label={key}>
                    {
                        this.renderOption(optGroupData[key])
                    }
                </OptGroup>
            )
        })
        const props = {
            allowClear:true,
            showSearch: true,
            optionFilterProp:"title",
            ...this.props
        }
        return (
            <Select {...props}>
                {option}
                {optGroup}
            </Select>
        )
    }
}

export default NscSelect;
