import React from 'react';
import styles from './DownloadButton.module.css';

const DownloadButton = ({ zipBase64, disabled }) => {
  const downloadZip = () => {
    const byteCharacters = atob(zipBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadZip}
      disabled={disabled}
      className={styles.button}
    >
      Скачать ZIP
    </button>
  );
};

export default DownloadButton;