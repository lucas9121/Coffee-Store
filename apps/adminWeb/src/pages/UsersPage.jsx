import { useState, useEffect } from "react";
import { getAdminUsers } from "../services/admin-users-api";
import Button from "../components/Button/Button";

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
    <main>
      <h1>Users</h1>
      <p>Manage user accounts and roles.</p>
      {loading ? (
        <p>loading...</p>
      ) : error ? <p>{error}</p> : 
      users.length === 0 ? (
        <p>No users found.</p>
      ) : <table>
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
              <td>{user.account}</td>
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
      }
    </main>
  );
}

export default UsersPage;