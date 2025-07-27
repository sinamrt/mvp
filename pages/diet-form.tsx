import dynamic from "next/dynamic";

// Create a client-only version of the diet form
const DietFormClient = dynamic(() => import('../components/DietFormClient'), {
  ssr: false,
  loading: () => <p>Loading diet form...</p>,
});

// Disable static generation for this page
export const getServerSideProps = () => {
  return {
    props: {},
  };
};

export default function DietForm() {
  return <DietFormClient />;
} 