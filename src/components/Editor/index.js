import React from 'react';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import styles from './index.less';

const defaultControls = [
  'undo',
  'redo',
  'separator',
  'text-color',
  'bold',
  'italic',
  'underline',
  'strike-through',
  'link',
  'separator',
  'text-indent',
  'text-align',
  'separator',
  'clear',
];

const Editor = (props) => (
  <div className={styles.editorWrapper}>
    <BraftEditor language="en" controls={defaultControls} {...props} />
  </div>
);

Editor.createEditorState = BraftEditor.createEditorState;

export default Editor;
