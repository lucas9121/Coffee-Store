import { useEffect } from "react";
import styles from "./Modal.module.css";

function Modal({ children, onClose, isSaving = false }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isSaving) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, isSaving]);

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget && !isSaving) {
      onClose();
    }
  }

  return (
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
    >
      <div className={styles.modal}>
        {children}
      </div>
    </div>
  );
}

export default Modal;