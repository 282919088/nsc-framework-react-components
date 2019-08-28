import React, { PureComponent } from 'react';
import utils from '../../../utils/utils';
import Store from '../../Data/Store/Store';
import TagSelect from '../../../components/TagSelect';

class NscTagSelect extends PureComponent {

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
        const { viewname, codes, data, url, params } = props;
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
        if (viewname || url) {
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

    renderOption(optionData, valueField) {
        return optionData.map(item => {
            return (
                <TagSelect.Option key={item.id || item.value} value={item[valueField]} title={item.title}>{item.title}</TagSelect.Option>
            )
        })
    }

    render() {
        const { dataSource } = this.state;
        const { valueField = "value" } = this.props;
        return (
            <TagSelect {...this.props}>
                {this.renderOption(dataSource, valueField)}
            </TagSelect>
        )
    }
}

export default NscTagSelect;
