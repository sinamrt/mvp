import AdminOnly from "../components/AdminOnly";

export default function AdminPage() {
  return (
    <AdminOnly>
      <h1>Admin Dashboard</h1>
      <p>Welcome, admin! Here you can manage users and view analytics.</p>
      {/* Add admin features here */}
    </AdminOnly>
  );
} 