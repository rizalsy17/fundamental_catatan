// ArchiveContext.js

import React, { createContext, useContext, useState } from 'react';
import { archiveNote, unarchiveNote } from '../utils/network-data';

// Buat context baru
const ArchiveContext = createContext();

// Buat custom hook untuk menggunakan context
export const useArchive = () => useContext(ArchiveContext);

// Buat provider untuk memastikan komponen-komponen di aplikasi memiliki akses ke state dan fungsi yang didefinisikan di dalam context
export const ArchiveProvider = ({ children }) => {
  const [archivedNotes, setArchivedNotes] = useState([]);

  // Fungsi untuk mengarsipkan catatan
  const handleArchive = async (noteId) => {
    try {
      const archiveNoteResponse = await archiveNote(noteId);
      if (!archiveNoteResponse.error) {
        // Perbarui state 'archivedNotes'
        setArchivedNotes(prevNotes => [...prevNotes, archiveNoteResponse.data]);
      } else {
        // Handle error
        console.error('Failed to archive note');
      }
    } catch (error) {
      // Handle error
      console.error('Failed to archive note', error);
    }
  };

  // Fungsi untuk mengembalikan catatan dari arsip
  const handleUnarchive = async (noteId) => {
    try {
      const unarchiveNoteResponse = await unarchiveNote(noteId);
      if (!unarchiveNoteResponse.error) {
        // Perbarui state 'archivedNotes'
        setArchivedNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      } else {
        // Handle error
        console.error('Failed to unarchive note');
      }
    } catch (error) {
      // Handle error
      console.error('Failed to unarchive note', error);
    }
  };

  return (
    <ArchiveContext.Provider value={{ archivedNotes, handleArchive, handleUnarchive }}>
      {children}
    </ArchiveContext.Provider>
  );
};
