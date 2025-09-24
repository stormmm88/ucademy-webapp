import React from "react";
import { menuItem } from "@/constants";
import Link from "next/link";
import { TMenuItem } from "@/types";
import { ActiveLink } from "../common";
import { UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../common/ModeToggle";

export default function Sidebar() {
  return (
    <div className="p-5 border-r border-r-gray-200 dark:border-gray-800 dark:bg-grayDarker dark:border/10 h-screen bg-white flex flex-col">
        <Link href="/" className="font-bold text-3xl inline-block mb-5">
            <span className="text-pri">U</span>
            cademy
        </Link>
        <ul className="flex flex-col gap-2">
            {menuItem.map((item, index) => (
                <MenuItem key={index} url={item.url} title={item.title} icon={item.icon}/>
            ))}
        </ul>
        <div className="mt-auto flex items-center justify-end gap-5">
            <ModeToggle></ModeToggle>
            <UserButton />  
        </div>
    </div>
  );
}

const MenuItem = ({url = "/", title = "", icon } : TMenuItem) => {
    return (
        <li>
            <ActiveLink url={url}>
                {icon}
                {title}
            </ActiveLink>
        </li>
    )
}