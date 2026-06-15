'use client';

import * as React from 'react';
import styles from './infoBlock.module.css';

export default function Loader() {
  return (
    <div className={styles.uvBrowserLoader} role="status" aria-label="Loading">
      <div className={styles.uvBody}>
        <div className={`${styles.uvRow} ${styles.uvH1}`}></div>
        <div className={styles.uvRow}></div>
        <div className={styles.uvRow}></div>
        <div className={`${styles.uvRow} ${styles.uvShort}`}></div>

        <div className={styles.uvTrace} aria-hidden="true"></div>

        <div className={styles.uvLoading}>
          <span>Loading</span>
          <span className={styles.uvEll}>…</span>
        </div>
      </div>
    </div>
  );
}