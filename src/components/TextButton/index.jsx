import React from 'react';
import classNames from 'classnames';
import styles from './index.less';

function TextButton(props) {
  const { children, className, onClick = () => {}, ...rest } = props;
  return (
    <span onClick={onClick} className={classNames(styles.textButton, className)} {...rest}>
      {children}
    </span>
  );
}

export default TextButton;
