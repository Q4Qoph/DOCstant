"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import PatientsRecordSkeleton from "../patients/loading";
import LabtestsList from "./(components)/LabtestsList";
import { useAuth } from "@/contexts/AuthContext";

export default function LabTests() {
  const {user} = useAuth()

  const {
    data: labTests,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["labtests"],
    queryFn: async () => {
      const response = await api.get("/api/LabTest/all",{params: {companyId: user?.companyId}} );
      return response.data;
    },
  });

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-6 px-8">
        <div>
          <h1 className="text-3xl font-bold">Lab Test Records</h1>
          <p>Review and manage laboratory tests</p>
        </div>
      </div>

      {isLoading ? (
        <PatientsRecordSkeleton />
      ) : (<LabtestsList labTests={labTests} />)
      }</div>)
}
