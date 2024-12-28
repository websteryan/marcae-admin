"use client";

import "jsvectormap/dist/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";

import { useRouter } from "next/navigation";
import { AuthProvider } from "@/context/auth-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();
  const [loading, setLoading] = useState(false); // Gerencia localmente o estado de loading


  if (loading) {
    return (
      <html lang="en">
        <body>
          <Loader />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          <AuthProvider>
            {children}
          </AuthProvider>
         
        </div>
      </body>
    </html>
  );
}
