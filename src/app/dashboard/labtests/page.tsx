"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";
import api from "@/lib/axios";
import PatientsRecordSkeleton from "../patients/loading";

export default function LabTests() {
  const router = useRouter();

  const {
    data: labTests,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["labtests"],
    queryFn: async () => {
      const response = await api.get("/api/LabTest/all");
      return response.data;
    },
  });

  const onView = (id: string) => {
    router.push(`/dashboard/labtests/${id}`);
  };

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
      ) : labTests.length === 0 ? (
        <Card>
          <CardContent className="text-center p-8">
            <p className="font-semibold text-lg">No lab tests found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 px-8">
          {labTests.map((test: any) => (
            <Card key={test.id}>
              <CardHeader className="border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{test.diagnosis?.name || "Unknown Patient"}</CardTitle>
                    <p className="text-sm text-gray-600">Age: {test.diagnosis?.age}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onView(test.id)}
                      variant="outline"
                      size="sm"
                      className="border-blue-300 hover:bg-blue-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 text-sm grid gap-2">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium">Test Name</p>
                    <p className="text-gray-700">{test.testName}</p>
                  </div>
                  <div>
                    <p className="font-medium">Test Date</p>
                    <p className="text-gray-700">
                      {new Date(test.testDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Cost</p>
                    <p className="text-gray-700">Ksh {test.cost}</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="font-medium text-xs mb-1">Result:</p>
                  <p className="text-gray-600 text-xs line-clamp-2">
                    {test.labTestResult || "Pending / Not Available"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
