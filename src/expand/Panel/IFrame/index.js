import React from 'react';
export default class NscIFrame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            iFrameHeight: '800px'//'100%'
        }
    }


    render() {
        const { src } = this.props;
        return (
            <iframe
                style={{ width: '100%', height: this.state.iFrameHeight, overflow: 'visible' }}
                ref="iframe"
                onLoad={() => {
                    this.setState({
                        // "iFrameHeight":  this.refs.iframe.contentWindow.parent.innerHeight-5 + 'px'
                        "iFrameHeight": this.refs.iframe.contentWindow.parent.innerHeight - 120 + 'px'
                    });
                }}
                src={src}
                scrolling="no"
                frameBorder="0"
            />
        );
    }
}