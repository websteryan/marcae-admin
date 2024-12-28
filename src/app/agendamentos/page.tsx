import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import TableThree from "@/components/Tables/TableThree";


import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProtectedRoute from "@/context/protectedRoute";

export const metadata: Metadata = {
  title: "Marcae | Agendamentos",
  description:
    "This is Next.js Tables page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};

const TablesPage = () => {

  return (
    <ProtectedRoute>
      <DefaultLayout>
        <Breadcrumb pageName="Agendamentos" />

        <div className="flex flex-col gap-10">
          <TableThree />
        </div>
      </DefaultLayout>
    </ProtectedRoute>
    
  );
};

export default TablesPage;
