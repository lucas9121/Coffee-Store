import { useEffect, useState } from "react";
import { getMenuItems, updateMenuItem } from "../services/menu-api";
import styles from "./MenuPage.module.css"
import Button from "../components/Button/Button";
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

  async function handleVisibility(item) {
    const visibilityChange = !item.isVisible
    try {
      await updateMenuItem(item._id, {isVisible: visibilityChange})
      setMenuItems((currentItems) => 
      currentItems.map((currentItem) => {
        if(currentItem._id === item._id){
          return {...currentItem, isVisible: visibilityChange}
        }
        return currentItem;
      }))
    } catch (error) {
      console.error(error)
    }
  }

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
                    <Button
                      variant={item.isVisible ? "success" : "secondary"}
                      size="sm"
                      onClick={() => handleVisibility(item)}
                    >
                      {item.isVisible ? "Displayed" : "Hidden"}
                    </Button>
                    <div className={styles.actions}>
                      <Button>Edit</Button>
                      <Button variant="danger">Delete</Button>
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