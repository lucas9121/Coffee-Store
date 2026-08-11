import { Outlet } from "react-router";
import Header from "./Header/Header";

function Layout() {
  return(
    <>
      <Header />
      <Outlet />
    </>
  )
};

export default Layout;