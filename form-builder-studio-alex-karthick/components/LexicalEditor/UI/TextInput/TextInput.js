import styles from './TextInput.module.css';

import * as React from 'react';

export default function TextInput({
  label,
  value,
  onChange,
  placeholder = '',
  'data-test-id': dataTestId,
}) {
  return (
    <div className={styles["Input__wrapper"]}>
      <label className={styles["Input__label"]}>{label}</label>
      <input
        type="text"
        className={styles["Input__input"]}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        data-test-id={dataTestId}
      />
    </div>
  );
}
