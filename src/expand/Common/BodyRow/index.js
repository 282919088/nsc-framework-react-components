import React from 'react';
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import styles from './index.less';
let draging = { index: -1 };

class BodyRow extends React.Component {
    render() {
        const { isOver, connectDragSource, connectDropTarget, moveRow, ...restProps } = this.props;
        const style = { ...restProps.style, cursor: 'move' };
        let className = restProps.className;
        if (isOver) {
            if (restProps.index > draging.index) {
                className += ` ${styles['drop-over-downward']}`;
            }
            if (restProps.index < draging.index) {
                className += ` ${styles['drop-over-upward']}`;
            }
        }
        return connectDragSource(
            connectDropTarget(<tr {...restProps} className={className} style={style} />),
        );
    }
}

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) return;
        props.moveRow(dragIndex, hoverIndex, draging, props);
        monitor.getItem().index = hoverIndex;
    },
}

const rowSource = {
    beginDrag(props) {
        draging = props;
        return {
            index: props.index
        };
    },
};

const DragableBodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
}))(
    DragSource('row', rowSource, connect => ({
        connectDragSource: connect.dragSource(),
    }))(BodyRow),
);

const BodyRowComponent = {
    body: {
        row: DragableBodyRow,
    },
};

BodyRow.BodyRowComponent = BodyRowComponent;
BodyRow.DragDropContext = DragDropContext;
BodyRow.HTML5Backend = HTML5Backend;

export {
    BodyRowComponent,
    DragDropContext,
    HTML5Backend
}

export default BodyRow;