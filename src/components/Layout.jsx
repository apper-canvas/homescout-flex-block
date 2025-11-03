import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {
  // App-level state and methods that can be passed to child components
  const outletContext = {
    // Add any shared state or methods here that child components need
    // For example: filters, shared modals, global app state
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Outlet context={outletContext} />
      </main>
    </div>
  );
};

export default Layout;