import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { OverviewTab } from '../components/dashboard/OverviewTab';
import { OrdersTab } from '../components/dashboard/OrdersTab';
import { ProductsTab } from '../components/dashboard/ProductsTab';
import { CustomersTab } from '../components/dashboard/CustomersTab';
import { AutomationsTab } from '../components/dashboard/AutomationsTab';
import { AnalyticsTab } from '../components/dashboard/AnalyticsTab';
import { SettingsTab } from '../components/dashboard/SettingsTab';
export function DashboardPage() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<OverviewTab />} />
        <Route path="/orders" element={<OrdersTab />} />
        <Route path="/products" element={<ProductsTab />} />
        <Route path="/customers" element={<CustomersTab />} />
        <Route path="/automations" element={<AutomationsTab />} />
        <Route path="/analytics" element={<AnalyticsTab />} />
        <Route path="/settings" element={<SettingsTab />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>);

}
