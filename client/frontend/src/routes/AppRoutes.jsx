import { Routes, Route } from "react-router-dom";
import Dashboard from "../components/ui/Dashboard";
import Products from "../components/ui/Products";
import Settings from "../components/ui/Settings";
import Suppliers from "../components/ui/Suppliers";
import Categories from "../components/Categories";
import Signup from "../components/auth/Signup";
import Login from "../components/auth/Login";
import ForgotPassword from "../components/auth/ForgotPassword";
import MainLayout from "../components/ui/MainLayout";
import VerifyPage from "../components/auth/VerifyPage";
import OtpPage from "../components/auth/OtpPage";
import ResetPassword from "../components/auth/ResetPassword";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Brands from "../components/ui/Brands";
import Stocks from "../components/ui/Stocks";
import Quotations from "../components/ui/Quotations";
import Taxes from "../components/ui/Taxes";
import Units from "../components/ui/Units";
import PaymentModes from "../components/ui/PaymentModes";
import PaymentTransactions from "../components/ui/PaymentTransactions";
import Invoices from "../components/ui/Invoices";
import Orders from "../components/ui/Orders";
import Roles from "../components/ui/Roles";
import RolePermissions from "../components/ui/RolePermissions";

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (

    <Routes>
      {/* Auth Routes */}
      
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password/verify" element={<VerifyPage />} />
      <Route path="/forgot-password/otp" element={<OtpPage />} />
      <Route
        path="/forgot-password/reset-password"
        element={<ResetPassword />}
      />

      {/* Main Layout Routes */}
      <Route path="/mainlayout" element={<MainLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="categories" element={<Categories />} />
        <Route path="products" >
          <Route path="brands" element={<Brands />} />
          <Route path="stocks" element={<Stocks />} />
        </Route>
        <Route path="suppliers" >
          <Route path="quotations" element={<Quotations />} />
        </Route>
        <Route path="finance-details">
          <Route path="taxes" element={<Taxes />}/>
          <Route path="units" element={<Units />}/>
          <Route path="payment-modes" element={<PaymentModes />}/>
          <Route path="payment-transactions" element={<PaymentTransactions />}/>
        </Route>
        <Route path="billing-details">
          <Route path="invoices" element={<Invoices />}/>
          <Route path="orders" element={<Orders />}/>
        </Route>
        <Route path="users">
          <Route path="roles" element={<Roles />}/>
          <Route path="role-permissions" element={<RolePermissions />}/>
        </Route>
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
