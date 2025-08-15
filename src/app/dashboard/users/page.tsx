import UserManagement from "./(components)/UsersList"
import { Roles } from "@/constants/roles"
import PageGuard from "@/app/(auth)/PageGuard"

const UsersPage = () => {
  return (
    <PageGuard allowedRoles={[Roles.ADMIN, Roles.SUPER_ADMIN]}>
      <UserManagement />
    </PageGuard>
  )
}

export default UsersPage