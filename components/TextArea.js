import React from 'react';
import styles from './TextArea.module.css';

const TextArea = ({ value, setValue }) => {
  return (
    <div className={styles.container}>
      <label>Опишите ваш сайт:</label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={styles.textarea}
        rows="5"
        placeholder="Например, блог о кулинарии..."
      />
    </div>
  );
};

export default TextArea;