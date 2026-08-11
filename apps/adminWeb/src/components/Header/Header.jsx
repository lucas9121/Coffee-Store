import styles from "./Header.module.css"
import { useState } from "react";
function Header(){
  const [show, setShow] = useState(false);
  
  return(
    <nav className={styles.header}>
      <div className={styles.logo}>
        <img src="/images/logo.jpg" alt="Catedral Cafe logo"/>
      </div>
      <ul className={styles.navLinks}>
        <li>Dashboard</li>
        <li>Menu</li>
        <li>Users</li>
        <li>Schedule</li>
      </ul>
      <div className={styles.adminUser}>
        <button type="button" onClick={() => setShow(!show)}>user icon</button>
        {
          show && 
          <ul className={styles.userMenu}>
            <li>Admin Name</li>
            <li>Settings</li>
            <li>Logout</li>
          </ul>
        }
      </div>
    </nav>
  )
}

export default Header;