import React from "react";
import AdminLayout from "./components/AdminLayout";
import AppointmentsPage from "./pages/AppointmentsPage";

export default function AdminApp() {
    return (
        <AdminLayout>
            <AppointmentsPage />
        </AdminLayout>
    );
}
