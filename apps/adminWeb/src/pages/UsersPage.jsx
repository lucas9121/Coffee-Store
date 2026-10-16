import { useState, useEffect } from "react";
import { getAdminUsers } from "../services/admin-users-api";
import Button from "../components/Button/Button";
import styles from "./UsersPage.module.css"

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAdminUsers();
        setUsers(data.users);
        setError("");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    })()
  },[])
  return (
    <main className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Users</h1>
        <p>Manage user accounts and roles.</p>
      </div>
      {loading ? (
        <p className={styles.statusMessage}>loading...</p>
      ) : error ? (
        <p className={`${styles.statusMessage} ${styles.error}`}>{error}</p>
      ) : users.length === 0 ? (
        <p className={styles.statusMessage}>No users found.</p>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Date Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`${styles.roleBadge} ${styles[user.account]}`}>
                      {user.account}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button variant="secondary" size="sm">
                      Change Role
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default UsersPage;