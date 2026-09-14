import Button from "../Button/Button";
import styles from "./MenuItemForm.module.css";

function MenuItemForm({
  item,
  setItem,
  onSubmit,
  onCancel,
  mode
}) {
  return(
    <section className={styles.menuItemForm}>
      <h2>
        {mode === "add" ? "Add Menu Item" : "Edit Menu Item"}
      </h2>

      <div className={styles.formGroup}>
        <label htmlFor="itemName">Name</label>
        <input
          id="itemName"
          type="text"
          value={item.name}
          onChange={(e) =>
            setItem({ ...item, name: e.target.value })
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
          value={item.price}
          onChange={(e) =>
            setItem({ ...item, price: e.target.value })
          }
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="itemImage">Image URL (optional)</label>
        <input
          id="itemImage"
          type="text"
          value={item.image}
          onChange={(e) =>
            setItem({ ...item, image: e.target.value })
          }
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="itemCategory">Category</label>
        <select
          id="itemCategory"
          value={item.category}
          onChange={(e) =>
            setItem({ ...item, category: e.target.value })
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
            checked={item.inStock}
            onChange={(e) =>
              setItem({ ...item, inStock: e.target.checked })
            }
          />
          In Stock
        </label>

        <label>
          <input
            type="checkbox"
            checked={item.isVisible}
            onChange={(e) =>
              setItem({ ...item, isVisible: e.target.checked })
            }
          />
          Displayed
        </label>
      </div>

      <div className={styles.formActions}>
        <Button onClick={() =>onSubmit(item)}>
          {mode === "add" ? "Add Item" : "Save Chages"}
        </Button>

        <Button
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </section>
  );
};

export default MenuItemForm;