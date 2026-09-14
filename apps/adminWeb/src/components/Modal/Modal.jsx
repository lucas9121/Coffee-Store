import { useEffect } from "react";
import styles from "./Modal.module.css";

function Modal({ children, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
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