import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdjust, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext'; 
import { useLanguage } from '../context/LanguageContext'; 

function Login() {
  const { loginUser } = useAuth();
  const { toggleTheme, theme } = useTheme(); // Memperbarui untuk mengambil tema saat ini
  const { toggleLanguage, language } = useLanguage(); // Memperbarui untuk mengambil bahasa saat ini
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#ffffff' : '#222222';
    const formContainer = document.querySelector('.registration-page');
    formContainer.style.backgroundColor = theme === 'light' ? '#ffffff' : '#222222';
    formContainer.style.color = theme === 'light' ? '#000000' : '#ffffff';
  }, [theme]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error: loginError } = await loginUser(email, password);
    if (loginError) {
      setError(language === 'id' ? 'Email atau password salah' : 'Incorrect email or password');
    } else {
      setError(null);
      window.location.href = '/'; // Redirect setelah login berhasil
    }
  };

  return (
    <div className='container'>
<div className="icon-row">
        <div className="theme-icon" onClick={toggleTheme}>
          <FontAwesomeIcon icon={faAdjust} />
        </div>
        <div className="language-icon" onClick={toggleLanguage}>
          <FontAwesomeIcon icon={faLanguage} />
        </div>
        </div>

    <div className="registration-container">
       
      <div className="registration-page">
        <h2>{language === 'id' ? 'Masuk' : 'Login'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
        <p>
        {language === 'id' ? 'Belum Punya Akun' : 'Dont Have Account?'} <Link to="/register">{language === 'id' ? 'Daftar Sekarang' : 'Sign Up'}</Link>
        </p>
      </div>
    </div>
    </div>
  );
}

export default Login;
