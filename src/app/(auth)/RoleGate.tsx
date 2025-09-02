"use client"

import { ReactNode } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Roles } from "@/constants/roles"
import { normalizeRole } from "@/utils/roles"

interface RoleGateProps {
  allowedRoles: Roles[]
  children: ReactNode
}

const RoleGate: React.FC<RoleGateProps> = ({ allowedRoles, children }) => {
  const { user } = useAuth()
  const normalizedRole = normalizeRole(user?.role)
  console.log(allowedRoles)
  console.log("Normalized", normalizedRole)
  if (!allowedRoles.includes(Number(normalizedRole))) return null;

  return <>{children}</>
}

export default RoleGate
