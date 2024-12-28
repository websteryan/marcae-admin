import ECommerce from "@/components/Dashboard/E-commerce";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { AuthProvider  } from "@/context/auth-context";
import ProtectedRoute from "@/context/protectedRoute";

export const metadata: Metadata = {
  title:
    "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Home() {
  return (
    <>
    <ProtectedRoute>
      <AuthProvider>
        <DefaultLayout>
            <ECommerce />
        </DefaultLayout>
      </AuthProvider>
    </ProtectedRoute>
    
     
    </>
  );
}
