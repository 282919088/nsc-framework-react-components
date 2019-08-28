import React, { PureComponent } from 'react';
import NscFormItem from './Item'
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
class NscFormBraftEditor extends NscFormItem {

    getFieldComponent(fieldProps) {
        return <BraftEditor {...fieldProps} />
    }
}

NscFormBraftEditor.createEditorState = function(v){
    return BraftEditor.createEditorState(v);
}

export default NscFormBraftEditor;