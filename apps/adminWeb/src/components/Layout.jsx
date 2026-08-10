import { Outlet } from "react-router";

function Layout() {
  return(
    <>
      <h1>Header</h1>
      <Outlet />
    </>
  )
};

export default Layout;