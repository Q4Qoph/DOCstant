"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Roles } from "@/constants/roles";
import { useRouter } from "next/navigation";

interface PageGuardProps {
  allowedRoles: (Roles | string)[];
  children: ReactNode;
}

const PageGuard: React.FC<PageGuardProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  const router = useRouter();

  // Normalize role to match enum
  const getNormalizedRole = (role: string | number): Roles | null => {
    if (role === Roles.ADMIN || role === "Admin") return Roles.ADMIN;
    if (role === Roles.SUPER_ADMIN || role === "Super Admin") return Roles.SUPER_ADMIN;
    if (typeof role === "number") return role as Roles;
    return null;
  };

  const normalizedRole = user ? getNormalizedRole(user.role) : null;

  useEffect(() => {
    if (!normalizedRole || !allowedRoles.includes(normalizedRole)) {
      router.push("/unauthorized");
    }
  }, [normalizedRole, allowedRoles, router]);

  if (!user || !normalizedRole || !allowedRoles.includes(normalizedRole)) {
    return null; // Prevent flash before redirect
  }

  return <>{children}</>;
};

export default PageGuard;
