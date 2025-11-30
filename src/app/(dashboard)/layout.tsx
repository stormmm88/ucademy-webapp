import Sidebar, { MenuItem } from "@/components/layout/sidebar";
import { menuItem } from "@/constants";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="wrapper block pb-20 lg:pb-0 lg:grid lg:grid-cols-[300px_1fr] min-h-screen">
      <Sidebar />

      {/* Menu mobile */}
      <ul className="flex p-3 border-t border-gray-200 lg:hidden fixed bottom-0 left-0 w-full justify-center gap-5 h-16">
          {menuItem.map((item, index) => (
              <MenuItem key={index} url={item.url} title={item.title} icon={item.icon} onlyIcon/>
          ))} 
      </ul>

      <div className="hidden lg:block"></div>
      <main className="p-5">{children}</main>
    </div>
   );
}

export default layout;  