import React from "react";
import { menuItem } from "@/constants";
import Link from "next/link";
import { TMenuItem } from "@/types";
import { ActiveLink } from "../common";
import { UserButton } from "@clerk/nextjs";

export default function Sidebar() {
  return (
    <div className="p-5 border-r border-gray-200 dark:border-gray-800 h-screen bg-white">
        <Link href="/" className="font-bold text-3xl inline-block mb-5">
            <span className="text-primary">U</span>
            cademy
        </Link>
        <ul className="flex flex-col gap-2">
            {menuItem.map((item, index) => (
                <MenuItem key={index} url={item.url} title={item.title} icon={item.icon}/>
            ))}
        </ul>
        <div className="flex mt-5">
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