import { useEffect, useState } from "react";
import { getMenuItems, updateMenuItem, deleteMenuItem, createMenuItem } from "../services/menu-api";
import MenuItemForm from "../components/MenuItemForm/MenuItemForm";
import styles from "./MenuPage.module.css"
import Button from "../components/Button/Button";
function MenuPage() {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
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
      });
      setError("");
    } catch (error) {
      setError(error.message)
      console.error(error)
    }
  };

  async function handleEdit(item) {
    try {
      const updatedItem = await updateMenuItem(item._id, {...item, price: Number(item.price)});
      setMenuItems((currentItems) => 
        currentItems.map((currentItem) => {
          if(currentItem._id === item._id) return updatedItem;
          return currentItem;
        })
      )
      setError("");
      setEditedItem(null);
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

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
      setError("");
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
      setError("");
    } catch (error) {
      setError(error.message)
      console.error(error)
    }
  };

  function handleOpenAddForm() {
    setShowAddForm(true);
    setEditedItem(null);
  }

  function handleOpenEditForm(item) {
    setEditedItem(item);
    setShowAddForm(false);
  }

  return (
    <main className={styles.menuPage}>
      <div className={styles.pageHeader}>
        {showAddForm && (
          <MenuItemForm
            item={newItem}
            setItem={setNewItem}
            onSubmit={handleCreate}
            onCancel={() => setShowAddForm(false)}
            mode="add"
          />
        )}
        {editedItem && (
          <MenuItemForm
            item={editedItem}
            setItem={setEditedItem}
            onSubmit={handleEdit}
            onCancel={() => setEditedItem(null)}
            mode="edit"
          />
        )}
        <h1>Menu</h1>
        <p>Manage Catedral Café menu items.</p>
        <Button 
        onClick={handleOpenAddForm}>
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
                      <Button onClick={() => handleOpenEditForm(item)}>
                        Edit
                      </Button>
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