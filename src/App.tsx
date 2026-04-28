import { Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Payments from "./pages/Payments";
import Checks from "./pages/Checks";
import Delivery from "./pages/Delivery";
import Customers from "./pages/Customers";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <div className="dark">
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/checks" element={<Checks />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </DashboardLayout>
      <Toaster position="top-right" richColors />
    </div>
  );
}

export default App;
