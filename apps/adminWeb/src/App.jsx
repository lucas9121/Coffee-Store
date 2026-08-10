import { Route, Routes } from "react-router";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
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
      </Route>
    </Routes>
  );
}


export default App;