import React from 'react';

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>
        FYP Project Architecture
      </h1>
      <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px' }}>
        Clean Full-Stack Architecture is setup and ready. Start adding your custom components, routes, and services!
      </p>
    </div>
  );
}
