import React from 'react';
import styles from './GenerateButton.module.css';

const GenerateButton = ({ onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles.button}
    >
      Сгенерировать
    </button>
  );
};

export default GenerateButton;