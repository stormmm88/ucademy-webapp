import Sidebar from "@/components/layout/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="wrapper grid grid-cols-[300px_1fr] min-h-screen">
      <Sidebar />
      <main className="p-5">{children}</main>
    </div>
   );
}

export default layout;  