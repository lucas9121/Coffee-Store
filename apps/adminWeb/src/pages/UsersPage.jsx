import { useState, useEffect, useRef } from "react";
import { getAdminUsers, updateUserAccount } from "../services/admin-users-api";
import Button from "../components/Button/Button";
import styles from "./UsersPage.module.css"
import Modal from "../components/Modal/Modal";
import { useAuth } from "../context/AuthContext";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");
  const { user :currentUser } = useAuth(); 
  const [isSaving, setIsSaving] = useState(false);
  const [roleError, setRoleError] = useState("");
  const savingRef = useRef(false);

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

  function handleOpenRoleModal(user){
    setSelectedUser(user);
    setNewRole(user.account);
    setRoleError("");
  };

  async function handleSaveRole(){
    if(savingRef.current) return;
    savingRef.current = true;
    setIsSaving(true);

    try {
      const { updatedUser } = await updateUserAccount(selectedUser._id, newRole);
      setUsers((currentUsers) => 
        currentUsers.map((user) => {
          if(user._id === selectedUser._id) return updatedUser;
          return user;
        })
      );
      setSelectedUser(null);
      setRoleError("");
    } catch (error) {
      setRoleError(error.message);
    } finally{
      savingRef.current = false;
      setIsSaving(false);
    }
  };

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
                      {user.account === "user" ? "Customer" : user.account === "worker" ? "Employee" : "Administrator"}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleOpenRoleModal(user)}
                      isDisabled={user._id === currentUser._id}
                    >
                      Change Role
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedUser && (
        <Modal
          onClose={() => setSelectedUser(null)}
          isSaving={isSaving}
        >
          <div className={styles.roleModal}>
            <div className={styles.roleModalHeader}>
              <h2>Change User Role</h2>
              <p>Update the account permissions for this user.</p>
            </div>

            <div className={styles.roleUserInfo}>
              <strong>{selectedUser.name}</strong>
              <span>{selectedUser.email}</span>
            </div>

            <div className={styles.roleField}>
              <label htmlFor="user-role">Account Role</label>
              <select
                id="user-role"
                value={newRole}
                onChange={(event) => setNewRole(event.target.value)}
                disabled={isSaving}
              >
                <option value="user">Customer</option>
                <option value="worker">Employee</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {roleError && (
              <p className={styles.error}>{roleError}</p>
            )}

            <div className={styles.roleModalActions}>
              <Button
                variant="ghost"
                onClick={() => setSelectedUser(null)}
                isDisabled={isSaving}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                onClick={handleSaveRole}
                isDisabled={isSaving || newRole === selectedUser.account}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </main>
  );
}

export default UsersPage;