import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdjust, faLanguage } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../context/ThemeContext'; 
import { useLanguage } from '../context/LanguageContext'; 
import { register } from '../utils/network-data';

function Register() {
  const { loginUser } = useAuth();
  const { toggleTheme, theme } = useTheme(); 
  const { toggleLanguage, language } = useLanguage(); 
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#ffffff' : '#222222';
    const formContainer = document.querySelector('.registration-page');
    formContainer.style.backgroundColor = theme === 'light' ? '#ffffff' : '#222222';
    formContainer.style.color = theme === 'light' ? '#000000' : '#ffffff';
  }, [theme]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError(language === 'id' ? 'Kata sandi dan konfirmasi kata sandi tidak cocok' : 'Password and confirm password do not match');
      return;
    }
    try {
      const response = await register(formData); 
      if (response && response.data) {
        await loginUser(formData.email, formData.password);
      }
      navigate('/login');
    } catch (error) {
      setError(language === 'id' ? 'Registrasi gagal. Silakan coba lagi.' : 'Registration failed. Please try again.');
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
        <h2>{language === 'id' ? 'Daftar' : 'Registration'}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{language === 'id' ? 'Nama' : 'Name'}:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>{language === 'id' ? 'Konfirmasi Password' : 'Confirm Password'}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">{language === 'id' ? 'Daftar' : 'Sign Up'}</button>
        </form>
        <p>
          {language === 'id' ? 'Sudah punya akun?' : 'Already have an account?'} <Link to="/login"> {language === 'id' ? 'Masuk' : 'Login'} </Link>
        </p>
      </div>
    </div>
    </div>
  );
}

export default Register;
