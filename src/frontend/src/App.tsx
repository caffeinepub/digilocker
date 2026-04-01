import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "dashboard">("home");
  const { identity } = useInternetIdentity();

  useEffect(() => {
    if (!identity && currentPage === "dashboard") {
      setCurrentPage("home");
    }
  }, [identity, currentPage]);

  return (
    <>
      <Toaster />
      {currentPage === "home" ? (
        <HomePage onNavigateDashboard={() => setCurrentPage("dashboard")} />
      ) : (
        <DashboardPage onNavigateHome={() => setCurrentPage("home")} />
      )}
    </>
  );
}
