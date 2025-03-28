import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

interface MainLayoutProps {
  isAuthenticated?: boolean;
  userRole?: "provider" | "subscriber";
}

const MainLayout = ({
  isAuthenticated = false,
  userRole = "subscriber",
}: MainLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Navbar isAuthenticated={isAuthenticated} userRole={userRole} />
      <main className="flex-grow pt-16 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
