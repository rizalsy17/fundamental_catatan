import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArchive,
  faTrash,
  faSignOutAlt,
  faAdjust,
  faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../components/Modal";
import noNotesImage from "../../public/empty.png";
import "../styles/style.css";
import { showFormattedDate } from "../utils/index";
import { archiveNote, deleteNote, getActiveNotes } from "../utils/network-data";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import PropTypes from "prop-types";

const Home = ({ notes, setAllNotes }) => {
  const { user, logoutUser } = useAuth();
  const { toggleTheme, theme } = useTheme();
  const { toggleLanguage, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    setFilteredNotes(notes);
    setIsLoading(false);
  }, [notes]);

  useEffect(() => {
    document.body.style.backgroundColor =
      theme === "light" ? "#ffffff" : "#222222";
  }, [theme]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!user && !accessToken) {
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchActiveNotes = async () => {
      try {
        setIsLoading(true);
        const { error, data } = await getActiveNotes();
        if (!error) {
          setAllNotes(data);
        } else {
          console.error("Failed to fetch active notes");
        }
      } catch (error) {
        console.error("Failed to fetch active notes", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveNotes();
  }, [setAllNotes]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.body.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [notes, searchTerm]);

  const handleDelete = async (noteId) => {
    try {
      setIsLoading(true);
      await deleteNote(noteId);
      setAllNotes((prevNotes) =>
        prevNotes.filter((note) => note.id !== noteId)
      );
      setShowModal(false);
    } catch (error) {
      console.error("Failed to delete note", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (noteId) => {
    try {
      setIsLoading(true);
      const archiveNoteResponse = await archiveNote(noteId);
      if (!archiveNoteResponse.error) {
        const updatedNotes = notes.filter((note) => note.id !== noteId);
        setAllNotes(updatedNotes);
        setShowModal(false);
      } else {
        console.error("Failed to archive note");
      }
    } catch (error) {
      console.error("Failed to archive note", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="container">
      {isLoading && <div className="loading-indicator">Loading...</div>}
      <Link to="/archive" className="arsip-button">
        <FontAwesomeIcon icon={faArchive} />{" "}
        {language === "id" ? "Arsip" : "Archive"}
      </Link>
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
      <header>
        <h1>{language === "id" ? "Aplikasi Catatan" : "Note App"}</h1>
      </header>

      <section className="content">
        <div
          className="search-container"
          style={{ backgroundColor: theme === "light" ? "#ffffff" : "#222222" }}
        >
          <input
            type="text"
            id="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={`${
              language === "id" ? "Cari Catatan" : "Search Note"
            }`}
            style={{
              backgroundColor: theme === "light" ? "#ffffff" : "#222222",
              color: theme === "light" ? "#000000" : "#ffffff",
            }}
          />
        </div>

        <div className="container">
          {filteredNotes.length === 0 ? (
            <img src={noNotesImage} alt="No Notes" className="no-notes-image" />
          ) : (
            <div className="note-cards">
              {filteredNotes.map((note) => (
                <div
                  className="note-card"
                  key={note.id}
                  style={{
                    backgroundColor: theme === "light" ? "#ffffff" : "#222222",
                  }}
                >
                  <Link to={`/note/${note.id}`}>
                    <h3>{note.title}</h3>
                  </Link>
                  <p>{showFormattedDate(note.createdAt)}</p>
                  <p>{note.body}</p>
                  <div className="actions">
                    <>
                      <button
                        className="archive-button"
                        onClick={() => {
                          setModalContent({
                            type: "confirm",
                            noteId: note.id,
                            message:
                              "Anda yakin ingin mengarsipkan catatan ini?",
                          });
                          setShowModal(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faArchive} />
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => {
                          setModalContent({
                            type: "delete",
                            noteId: note.id,
                          });
                          setShowModal(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {showModal && (
          <Modal
            content={modalContent}
            onDeleteNote={handleDelete}
            onClose={() => setShowModal(false)}
            onArchive={handleArchive}
          />
        )}
        <div className="action-buttons">
          <Link to="/addnote" className="add-note-button">
            <FontAwesomeIcon icon={faPlus} />
          </Link>
        </div>
      </section>
    </div>
  );
};

Home.propTypes = {
  notes: PropTypes.array.isRequired,
  setAllNotes: PropTypes.func.isRequired,
};

export default Home;
