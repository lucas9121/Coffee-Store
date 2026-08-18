import styles from "./Header.module.css"
import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

function Header(){
  const [show, setShow] = useState(false);
  const { user, logout }  = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout()
    navigate("/login", {replace: true})
  }
  
  return(
    <nav className={styles.header}>
      <div className={styles.logo}>
        <img src="/images/logo.jpg" alt="Catedral Cafe logo"/>
      </div>
      <ul className={styles.navLinks}>
        <li><NavLink to="/"> Dashboard</NavLink></li>
        <li><NavLink to="/menu"> Menu</NavLink></li>
        <li><NavLink to="/users"> Users</NavLink></li>
        <li><NavLink to="/schedule"> Schedule</NavLink></li>
      </ul>
      <div className={styles.adminUser}>
        <button type="button" onClick={() => setShow(!show)}>user icon</button>
        {
          show && 
          <ul className={styles.userMenu}>
            <li>{user?.name}</li>
            <li><NavLink to="/settings">Settings</NavLink></li>
            <li>
              <button type="button" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        }
      </div>
    </nav>
  )
}

export default Header;