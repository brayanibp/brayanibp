import React from 'react';
import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.errorCode}>404</h1>
        <p className={styles.message}>Oops! The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link 
          className={styles.button} 
          href={`/`}
        >
          Go Back Home
        </Link>
        <Link 
          href={`/blog`} 
          className={styles.link}
        >
          Visit my latest posts instead
        </Link>
      </div>
    </>
  );
};
