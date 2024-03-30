import React, { useState, useEffect } from 'react';
import { useParams, Link,useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignOutAlt, faAdjust, faLanguage } from '@fortawesome/free-solid-svg-icons';
// import PropTypes from 'prop-types';
import { getNote } from '../utils/network-data';
import { useLanguage } from '../context/LanguageContext'; 
import { useTheme } from '../context/ThemeContext'; 
import { useAuth } from '../context/AuthContext';

const NoteDetail = () => {
  const { user, logoutUser } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const { toggleLanguage, language } = useLanguage(); 
  const navigate = useNavigate();
  const { id } = useParams();
  const [note, setNote] = useState(null);

  useEffect(() => {
    fetchNoteDetail();
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = theme === 'light' ? '#ffffff' : '#222222';
   
  }, [theme]);

  const fetchNoteDetail = async () => {
    try {
      const noteDetailResponse = await getNote(id);
      if (!noteDetailResponse.error) {
        setNote(noteDetailResponse.data);
      } else {
        // Handle error
        console.error('Failed to fetch note detail');
      }
    } catch (error) {
      // Handle error
      console.error('Failed to fetch note detail', error);
    }
  };

  if (!note) {
    return <p>{language === 'id' ? 'Catatan tidak ditemukan' : 'Record not found'}</p>;
  }


  const handleLogout = () => {
    logoutUser(); 
    navigate('/login');
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
    <div className="logout-icon" onClick={handleLogout}>
      <FontAwesomeIcon icon={faSignOutAlt} />
    </div>
  </div>
    <div className="center-container">
<div className="note-detail-container">
        <Link to="/" className="back-button-form">
          <FontAwesomeIcon icon={faHome} /> {language === 'id' ? 'Kembali' : 'Back'}
        </Link>
        <h1 className="note-title">{note.title}</h1>
        <p className="note-meta">{new Date(note.createdAt).toLocaleString()}</p>
        <div className="note-detail" style={{ backgroundColor: theme === 'light' ? '#ffffff' : '#222222' }}>
          <p>{note.body}</p>
        </div>
      </div>
      </div>
    </div>
  );
};

// NoteDetail.propTypes = {
//   notes: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
//       title: PropTypes.string.isRequired,
//       createdAt: PropTypes.string.isRequired,
//       body: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

export default NoteDetail;