"use client";

import React, { useEffect, useState } from "react";
import { menuItem } from "@/constants";
import Link from "next/link";
import { TMenuItem } from "@/types";
import { ActiveLink } from "../common";
import { useAuth, UserButton } from "@clerk/nextjs";
import { ModeToggle } from "../common/ModeToggle";
import { IconUsers } from "../Icons";
import { getUserInfo } from "@/lib/actions/user.actions";
import { EUserRole } from "@/types/enums";
import { getPendingOrdersCount, getPendingCommentsCount } from "@/lib/actions/notification.actions";

interface MenuItemWithBadge extends TMenuItem {
  badge?: number;
  adminOnly?: boolean;
}

export default function Sidebar() {
  const { userId } = useAuth();
  const [userRole, setUserRole] = useState<EUserRole | null>(null);
  const [badges, setBadges] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!userId) return;
      try {
        const user = await getUserInfo({ userId });
        setUserRole(user?.role || null);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [userId]);

  // Fetch notification badges
  useEffect(() => {
    if (userRole !== EUserRole.ADMIN) return;

    const fetchBadges = async () => {
      try {
        const [ordersCount, commentsCount] = await Promise.all([
          getPendingOrdersCount(),
          getPendingCommentsCount(),
        ]);

        setBadges({
          orders: ordersCount || 0,
          comments: commentsCount || 0,
        });
      } catch (error) {
        console.error("Error fetching badges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();

    // Polling every 30 seconds
    const interval = setInterval(fetchBadges, 30000);
    return () => clearInterval(interval);
  }, [userRole]);

  // Filter menu items based on role
  const filteredMenuItems: MenuItemWithBadge[] = menuItem
    .map((item) => {
      let badge = 0;

      if (item.url === "/manage/orders") {
        badge = badges.orders || 0;
        return { ...item, badge, adminOnly: true };
      }

      if (item.url === "/manage/comments") {
        badge = badges.comments || 0;
        return { ...item, badge, adminOnly: true };
      }

      if (item.url === "/manage/courses" || item.url === "/manage/members") {
        return { ...item, adminOnly: true };
      }

      if (item.url === "/manage/categories" || item.url === "/manage/categories") {
        return { ...item, adminOnly: true };
      }

      return { ...item, adminOnly: false };
    })
    .filter((item) => {
      if (item.adminOnly && userRole !== EUserRole.ADMIN) {
        return false;
      }
      return true;
    });

  return (
    <div className="p-5 border-r border-r-gray-200 dark:border-gray-800 dark:bg-grayDarker dark:border/10 bg-white lg:flex flex-col inset-y-0 left-0 hidden w-[300px] fixed top-0 left-0 bottom-0">
      {/* Logo */}
      <Link href="/" className="font-bold text-3xl inline-block mb-5">
        <span className="text-pri">VIED</span>
        LAB
      </Link>

      {/* Menu Items */}
      <ul className="flex flex-col gap-2">
        {mounted && filteredMenuItems.map((item, index) => (
          <MenuItem
            key={index}
            url={item.url}
            title={item.title}
            icon={item.icon}
            badge={item.badge}
          />
        ))}
      </ul>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-end gap-5">
        <ModeToggle></ModeToggle>
        {mounted && (!userId ? (
          <Link
            href="/sign-in"
            className="size-10 rounded-lg bg-pri text-white flex items-center justify-center p-1"
          >
            <IconUsers />
          </Link>
        ) : (
          <UserButton />
        )
        )}
      </div>
    </div>
  );
}

interface MenuItemProps extends TMenuItem {
  badge?: number;
}

export const MenuItem = ({ url = "/", title = "", icon, badge, onlyIcon }: MenuItemProps) => {
  return (
    <li className="relative">
      <ActiveLink url={url}>
        {icon}
        {onlyIcon ? null : (
          <div className="flex items-center gap-2 flex-1">
            <span>{title}</span>
            {badge !== undefined && badge > 0 && (
              <span className="ml-auto flex items-center justify-center min-w-[24px] h-6 px-2 rounded-full bg-red-500 text-white text-xs font-bold">
                {badge > 99 ? "99+" : badge}
              </span>
            )}
          </div>
        )}
      </ActiveLink>
    </li>
  );
};