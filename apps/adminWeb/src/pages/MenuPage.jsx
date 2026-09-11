import { useEffect, useState } from "react";
import { getMenuItems, updateMenuItem, deleteMenuItem, createMenuItem } from "../services/menu-api";
import styles from "./MenuPage.module.css"
import Button from "../components/Button/Button";
function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    image: "",
    category: "coffee",
    inStock: true,
    isVisible: true,
  });

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

  async function handleCreate(item) {
    try {
      const createdItem = await createMenuItem({
        ...item,
        price: Number(item.price)
      })
      setMenuItems((currentItems) => [...currentItems, createdItem])
      setShowAddForm(false);
      setNewItem({
        name: "",
        price: "",
        image: "",
        category: "coffee",
        inStock: true,
        isVisible: true,
      })
    } catch (error) {
      setError(error.message)
      console.error(error)
    }
  }

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
      setError(error.message)
      console.error(error)
    }
  }

  async function handleDelete(item){
    const confirmed = window.confirm("Are you sure you want to delete this menu item?")
    if(!confirmed) return
    try {
      await deleteMenuItem(item._id)
      setMenuItems((currentItems) => 
        currentItems.filter((currentItem) => currentItem._id !== item._id)
      )
    } catch (error) {
      setError(error.message)
      console.error(error)
    }
  }

  return (
    <main className={styles.menuPage}>
      <div className={styles.pageHeader}>
        {showAddForm && (
          <section className={styles.addForm}>
            <h2>Add Menu Item</h2>

            <div className={styles.formGroup}>
              <label htmlFor="itemName">Name</label>
              <input
                id="itemName"
                type="text"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="itemPrice">Price</label>
              <input
                id="itemPrice"
                type="number"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) =>
                  setNewItem({ ...newItem, price: e.target.value })
                }
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="itemImage">Image URL (optional)</label>
              <input
                id="itemImage"
                type="text"
                value={newItem.image}
                onChange={(e) =>
                  setNewItem({ ...newItem, image: e.target.value })
                }
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="itemCategory">Category</label>
              <select
                id="itemCategory"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
              >
                <option value="coffee">Coffee</option>
                <option value="juice">Juice</option>
                <option value="food">Food</option>
                <option value="dessert">Dessert</option>
              </select>
            </div>

            <div className={styles.checkboxRow}>
              <label>
                <input
                  type="checkbox"
                  checked={newItem.inStock}
                  onChange={(e) =>
                    setNewItem({ ...newItem, inStock: e.target.checked })
                  }
                />
                In Stock
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={newItem.isVisible}
                  onChange={(e) =>
                    setNewItem({ ...newItem, isVisible: e.target.checked })
                  }
                />
                Displayed
              </label>
            </div>

            <div className={styles.formActions}>
              <Button onClick={() =>handleCreate(newItem)}>
                Add Item
              </Button>

              <Button
                variant="secondary"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
            </div>
          </section>
        )}
        <h1>Menu</h1>
        <p>Manage Catedral Café menu items.</p>
        <Button 
        onClick={() => setShowAddForm(true)}>
          Add Menu Item
        </Button>
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
                      <Button 
                      variant="danger"
                      onClick={() => handleDelete(item)}
                      >
                        Delete
                      </Button>
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