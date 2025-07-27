
import dynamic from "next/dynamic";

// Dynamically import AdminOnly to prevent SSR issues
const AdminOnly = dynamic(() => import("../components/AdminOnly"), {
  ssr: false,
  loading: () => <p>Loading admin interface...</p>,
});

// Disable static generation for this page
export const getServerSideProps = () => {
  return {
    props: {},
  };
};

export default function AdminPage() {
  return (
    <AdminOnly>
      <h1>Admin Dashboard</h1>
      <p>Welcome, admin! Here you can manage users and view analytics.</p>
      {/* Add admin features here */}
    </AdminOnly>
  );
} 