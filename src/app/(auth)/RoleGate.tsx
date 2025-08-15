"use client";

import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Roles } from "@/constants/roles";

interface RoleGateProps {
  allowedRoles: Roles[];
  children: ReactNode;
}

const RoleGate: React.FC<RoleGateProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role as Roles)) {
    return null; // Hide element
  }

  return <>{children}</>;
};

export default RoleGate;
