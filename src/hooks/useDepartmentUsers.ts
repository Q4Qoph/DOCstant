import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

export const useDepartmentUsers = (role: number) => {
  const { user } = useAuth()

  return useQuery({
    queryKey: ["departmentUsers", role],
    queryFn: async () => {
      const res = await api.get(`/api/User/department`, {
        params: { role, companyId: user?.companyId },
      });
      return res.data;
    },
    enabled: role !== undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
