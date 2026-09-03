import { useEffect, useState } from "react";
import { getMenuItems } from "../services/menu-api";
import styles from "./MenuPage.module.css"
function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect( () => {
    (async () => {
      try {
        setLoading(true)
        const data = await getMenuItems()
        setMenuItems(data)
        setError("")
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <main className={styles.menuPage}>
      <div className={styles.pageHeader}>
        <h1>Menu</h1>
        <p>Manage Catedral Café mneu items.</p>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      { loading ? (
          <p>loading...</p> 
        ) : (
          <div className={styles.menuGrid}>
            {menuItems.map((item) => {
              return(
                <div key={item._id} className={styles.menuCard}>
                  <img 
                    className={styles.menuImage}
                    src={item.image || "/images/logo.jpg" } 
                    alt={item.name} 
                  />
                  <div className={styles.menuContent}>
                    <p className={styles.menuName}>{item.name} </p>
                    <p className={styles.category}>{item.category} </p>
                    <p className={styles.price}>${item.price.toFixed(2)} </p>
                    <p className={item.inStock ? styles.inStock : styles.outOfStock}>{item.inStock ? "In Stock" : "Out of Stock"} </p>
                    <button type="button" className={item.isVisible ? styles.visibleButton : styles.hiddenButton}>
                      {item.isVisible ? "Displayed" : "Hidden"}
                    </button>
                    <div className={styles.actions}>
                      <button type="button" className={styles.editButton}>Edit </button>
                      <button type="button" className={styles.deleteButton}>Delete </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )
      }
    </main>
  );
}

export default MenuPage;