import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Components/layout/Header.jsx";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default React.memo(MainLayout);
