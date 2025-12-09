'use client'

import { useContext } from 'react';
import { ThemeContext } from '@/lib/context/ThemeContext';
import styles from './styles.module.scss';

export default function ThemeToggleSwitch({ id = 'theme-switch' }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const checked = theme === 'dark';

  return (
    <div className={styles.switch}>
      <input
        id={id}
        className={styles.switch__input}
        type="checkbox"
        checked={checked}
        onChange={() => toggleTheme()}
        aria-checked={checked}
        role="switch"
      />
      <label className={styles.switch__label} htmlFor={id} aria-hidden="false">
        <span className={styles.switch__indicator} />
        <span className={styles.switch__decoration} />
      </label>
    </div>
  );
}