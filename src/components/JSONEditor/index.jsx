import React from 'react';
import { Button, message } from 'antd';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { isJSON, beautifyJSON } from '@/utils';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/idea.css';
import styles from './index.less';

function JSONEditor(props) {
  const { value, onChange } = props;

  const handleFormat = () => {
    if (!isJSON(value)) {
      message.warning('Invalid JSON.');
      return;
    }
    onChange(beautifyJSON(value));
  };

  return (
    <div className={styles.container}>
      <CodeMirror
        options={{
          mode: 'application/json',
          theme: 'idea',
          lineNumbers: true,
          indentUnit: 2,
          smartIndent: true,
          tabSize: 2,
        }}
        value={value}
        onBeforeChange={(...args) => onChange(args[2])}
      />
      <Button type="primary" className={styles.formatButton} onClick={handleFormat}>
        Format
      </Button>
    </div>
  );
}

export default JSONEditor;
