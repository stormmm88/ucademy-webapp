"use client";

import React from "react";
import { menuItem } from "@/constants";
import Link from "next/link";
import { TMenuItem } from "@/types";
import { ActiveLink } from "../common";
import { useAuth, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../common/ModeToggle";
import { IconUsers } from "../Icons";

export default function Sidebar() {
    const { userId } = useAuth();
  return (
    <div className="p-5 border-r border-r-gray-200 dark:border-gray-800 dark:bg-grayDarker dark:border/10 bg-white lg:flex flex-col inset-y-0 left-0 hidden w-[300px] fixed top-0 left-0 bottom-0">
        <Link href="/" className="font-bold text-3xl inline-block mb-5">
            <span className="text-pri">VIED</span>
            LAB
        </Link>
        <ul className="flex flex-col gap-2">
            {menuItem.map((item, index) => (
                <MenuItem key={index} url={item.url} title={item.title} icon={item.icon}/>
            ))} 
        </ul>
        <div className="mt-auto flex items-center justify-end gap-5">
            <ModeToggle></ModeToggle>
            {!userId ? (
                <Link href="/sign-in" className="size-10 rounded-lg bg-pri text-white flex-items-center justify-center p-1">
                    <IconUsers />
                </Link>
            ) : (
                <UserButton />  
            )}
        </div>
    </div>
  );
}

export const MenuItem = ({url = "/", title = "", icon, onlyIcon } : TMenuItem) => {
    return (
        <li>
            <ActiveLink url={url}>
                {icon}
                {onlyIcon ? null : title}
            </ActiveLink>
        </li>
    )
}