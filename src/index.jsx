// index.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './styles/style.css';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext'; // Tambahkan ini
import { ThemeProvider } from './context/ThemeContext'; // Dan ini


const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <AuthProvider>
      <LanguageProvider> {/* Tambahkan LanguageProvider di sini */}
        <ThemeProvider> {/* Dan ThemeProvider di sini */}
          <App />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  </Router>
);
