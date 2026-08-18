import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import MenuPage from "./pages/MenuPage";
import SchedulePage from "./pages/SchedulePage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        } 
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/menu" element={<MenuPage />}/>
        <Route path="/users" element={<UsersPage />}/>
        <Route path="/schedule" element={<SchedulePage />}/>
        <Route path="/settings" element={<SettingsPage />}/>
      </Route>
    </Routes>
  );
}


export default App;