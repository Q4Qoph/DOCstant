import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useDepartmentUsers = (role: number) => {
  return useQuery({
    queryKey: ["departmentUsers", role],
    queryFn: async () => {
      const res = await api.get(`/api/User/department`, {
        params: { role },
      });
      return res.data;
    },
    enabled: role !== undefined,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
