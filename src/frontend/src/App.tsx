import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import CertificatePage from "./pages/CertificatePage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";

export default function App() {
  const [currentPage, setCurrentPage] = useState<
    "home" | "dashboard" | "certificate"
  >("home");
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
        <HomePage
          onNavigateDashboard={() => setCurrentPage("dashboard")}
          onNavigateCertificate={() => setCurrentPage("certificate")}
        />
      ) : currentPage === "certificate" ? (
        <CertificatePage onBack={() => setCurrentPage("home")} />
      ) : (
        <DashboardPage onNavigateHome={() => setCurrentPage("home")} />
      )}
    </>
  );
}
