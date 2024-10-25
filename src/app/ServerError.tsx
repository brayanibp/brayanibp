import React from 'react';
import Link from 'next/link';

const ServerError: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>500</h1>
      <p style={styles.message}>Something went wrong on our end. Please try again later.</p>
      <Link href="/">
        <a style={styles.button}>Go Back Home</a>
      </Link>
      <Link href="/contact">
        <a style={styles.link}>Report this issue</a>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f9f9f9',
    textAlign: 'center' as const,
    color: '#333',
  },
  errorCode: {
    fontSize: '6rem',
    fontWeight: 'bold' as const,
    marginBottom: '1rem',
  },
  message: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    backgroundColor: '#dc3545', // Red color for errors
    color: '#fff',
    borderRadius: '5px',
    textDecoration: 'none',
  },
  link: {
    marginTop: '1rem',
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '0.9rem',
  }
};

export default ServerError;
