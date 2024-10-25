import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.errorCode}>404</h1>
        <p style={styles.message}>Oops! The page you’re looking for doesn’t exist.</p>
        <Link style={styles.button} href={`/`}>
          Go Back Home
        </Link>
        <Link href={`/blog`} style={styles.link}>Visit my latest posts instead</Link>
      </div>
    </>
  );
};

// Inline styles for simplicity, but consider using CSS modules or styled-components for better scalability
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f9f9f9', // adjust this to your theme color
    textAlign: 'center' as const,
    color: '#333', // primary text color
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
    backgroundColor: '#007bff', // accent color for your theme
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer' as const,
    transition: 'background-color 0.3s',
  },
  link: {
    marginTop: '1rem',
    color: '#007bff',
    textDecoration: 'none',
    fontSize: '0.9rem',
  }
};