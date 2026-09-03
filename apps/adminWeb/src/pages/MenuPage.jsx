import { useEffect, useState } from "react";
import { getMenuItems } from "../services/menu-api";
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
  console.log(menuItems)

  return (
    <main>
      <h1>Menu</h1>
      {error && <p>{error}</p>}
      {
        loading ?
        <p>loading...</p> :
        menuItems.map((item) => {
          return(
            <div key={item._id}>
              <img src={item.image || "/images/logo.jpg" } alt={item.name} />
              <p className="menuItem">{item.name} </p>
              <p className="menuItem">{item.category} </p>
              <p className="menuItem">${item.price.toFixed(2)} </p>
              <p className="menuItem">{item.inStock ? "In Stock" : "Out of Stock"} </p>
              <button type="button" className="menuAction">Edit </button>
              <button type="button" className="menuAction">Delete </button>
            </div>
          )
        })
      }
    </main>
  );
}

export default MenuPage;