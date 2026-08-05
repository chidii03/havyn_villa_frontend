"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ProfileMenu() {
  const { status, user, logout } = useAuth();
  const isAuthenticated = status === "authenticated" && user !== null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-11 gap-2 rounded-full border-line pr-1.5 pl-3"
            aria-label={isAuthenticated ? `Account menu for ${user.fullName ?? user.email}` : "Account menu"}
          />
        }
      >
        <Icon name="menu" size={16} />
        <Avatar size="sm">
          {isAuthenticated && user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
          <AvatarFallback>
            {isAuthenticated && user.fullName ? initials(user.fullName) : <Icon name="user" size={14} />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {isAuthenticated ? (
          <DropdownMenuGroup>
            <DropdownMenuLabel className="truncate">{user.fullName ?? user.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/trips" />}>Trips</DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/messages" />}>Messages</DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/wishlists" />}>Wishlists</DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/account" />}>Account</DropdownMenuItem>
            {user.roles.includes("HOST") && (
              <DropdownMenuItem render={<Link href="/host" />}>Host dashboard</DropdownMenuItem>
            )}
            {user.roles.includes("ADMIN") && (
              <DropdownMenuItem render={<Link href="/admin" />}>Admin</DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => void logout()}>Log out</DropdownMenuItem>
          </DropdownMenuGroup>
        ) : (
          <>
            <DropdownMenuItem render={<Link href="/login" className="font-semibold" />}>Log in</DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/signup" />}>Sign up</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem render={<Link href="/become-a-host" />}>Become a host</DropdownMenuItem>
            <DropdownMenuItem render={<Link href="/help" />}>Help Center</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function initials(fullName: string): string {
  return fullName
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
