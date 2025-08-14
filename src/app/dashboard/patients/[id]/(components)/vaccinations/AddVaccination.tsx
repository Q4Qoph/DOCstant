"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Vaccination {
  vaccineName: string;
}

interface Props {
  patientId: string;
  patientData?: { vaccinations?: Vaccination[] };
  onSuccess: () => void;
}

export default function VaccinationForm({ patientId, patientData, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  
  // Initialize vaccinations state with existing data or empty array with one item
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(
    patientData?.vaccinations?.length 
      ? patientData.vaccinations 
      : [{ vaccineName: "" }]
  );

  const addVaccination = () => {
    setVaccinations(prev => [...prev, { vaccineName: "" }]);
  };

  const removeVaccination = (index: number) => {
    setVaccinations(prev => prev.filter((_, i) => i !== index));
  };

  const updateVaccination = (index: number, value: string) => {
    setVaccinations(prev =>
      prev.map((v, i) => (i === index ? { vaccineName: value } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.put(`/api/DiagnosisRecord/${patientId}`, {
          vaccinations,
          ...patientData,
      });
      if (response.status === 200) {
        toast.success("Vaccinations updated successfully!");
        queryClient.invalidateQueries({ queryKey: ["patient", patientId] });
        onSuccess();
      }
    } catch (error: any) {
      toast.error("Failed to update vaccinations.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-semibold">Vaccinations</Label>
        <Button
          type="button"
          onClick={addVaccination}
          variant="outline"
          size="sm"
          className="border-blue-300 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {vaccinations.map((vac, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={vac.vaccineName}
              onChange={e => updateVaccination(index, e.target.value)}
              placeholder="Vaccine name"
              className="border-blue-200 focus:border-blue-500"
            />
            {vaccinations.length > 1 && (
              <Button
                type="button"
                onClick={() => removeVaccination(index)}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-50 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Saving..." : "Save Vaccinations"}
        </Button>
      </div>
    </form>
  );
}