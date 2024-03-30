import React from 'react';

// import PropTypes from 'prop-types';

const Modal = ({ content, onDeleteNote, onClose, onArchive, onUnarchive }) => {

  const handleConfirm = () => {
    if (content.type === 'delete') {
      onDeleteNote && onDeleteNote(content.noteId);
    } else if (content.type === 'confirm') {
      onArchive && onArchive(content.noteId);
    } else if (content.type === 'activate') {
      onUnarchive && onUnarchive(content.noteId);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <div className="modal-content">
          {content.type === 'delete' && (
            <>
              <h2>Konfirmasi Hapus</h2>
              <p>Anda yakin ingin menghapus catatan ini?</p>
              <button className="confirm-button" onClick={handleConfirm}>
                Hapus
              </button>
            </>
          )}

          {content.type === 'confirm' && (
            <>
              <h2>Konfirmasi Arsip</h2>
              <p>{content.message}</p>
              <button className="confirm-button" onClick={handleConfirm}>
                Arsipkan
              </button>
            </>
          )}

          {content.type === 'activate' && (
            <>
              <h2>Konfirmasi Aktivasi</h2>
              <p>{content.message}</p>
              <button className="confirm-button" onClick={handleConfirm}>
                Aktifkan
              </button>
            </>
          )}

          {content.type === 'detail' && (
            <>
              <h2>Detail Catatan</h2>
              <div className="detail-info">
                <p><strong>ID:</strong> {content.noteId}</p>
                <p><strong>Judul:</strong> {content.noteTitle}</p>
                <div className="note-content">
                  <p><strong>Isi Catatan:</strong></p>
                  <pre>{content.noteContent}</pre>
                </div>
                <p><strong>Arsip:</strong> {content.archived ? 'Aktif' : 'Nonaktif'}</p>
                <p><strong>Dibuat Pada:</strong> {new Date(content.createdAt).toLocaleString()}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
// Modal.propTypes = {
//   content: PropTypes.shape({
//     type: PropTypes.oneOf(['delete', 'confirm', 'activate', 'detail']).isRequired,
//     message: PropTypes.string,
//     noteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), 
//     noteTitle: PropTypes.string,
//     noteContent: PropTypes.string,
//     archived: PropTypes.bool,
//     createdAt: PropTypes.string,
//   }).isRequired,
//   onDeleteNote: PropTypes.func,
//   onClose: PropTypes.func.isRequired,
//   onArchive: PropTypes.func,
//   onUnarchive: PropTypes.func,
// };
export default Modal;
