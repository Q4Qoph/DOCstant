"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import api from "@/lib/axios"
import { Loader2 } from "lucide-react"
import { z } from "zod"
import { toast } from "sonner"
import { useDepartmentUsers } from "@/hooks/useDepartmentUsers"
import { useNotifications } from "@/hooks/useNotifications"
import { useAuth } from "@/contexts/AuthContext"

interface PrescriptionFormProps {
  diagnosisId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}
const prescriptionSchema = z.object({
  diagnosisId: z.string().nonempty("Diagnosis ID is required"),
  drugName: z.string().min(1, "Drug name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  medicineDosage: z.string().min(1, "Dosage is required"),
  comments: z.string().optional(),
})

const PrescriptionSheet = ({ diagnosisId, open, onOpenChange }: PrescriptionFormProps) => {
  const { data: pharmacists } = useDepartmentUsers(3);
  const { sendNotification } = useNotifications()
  const { user } = useAuth()
  const [drugName, setDrugName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [medicineDosage, setMedicineDosage] = useState("")
  const [comments, setComments] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async () => {
    setLoading(true)
    setErrors({})

    const result = prescriptionSchema.safeParse({
      diagnosisId,
      drugName,
      quantity,
      medicineDosage,
      comments,
    })

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message
      })
      setErrors(fieldErrors)
      setLoading(false)
      return
    }

    try {
      await api.post("/api/prescription", result.data)
      toast.success("Prescription saved successfully.")
      if (pharmacists && pharmacists.length > 0) {
        sendNotification({
          title: "Medication Approval Request",
          message: `A prescription has been submitted. Please <a href="/patients/diagnosis/${diagnosisId}" class="text-blue-600 underline">review and approve</a> the medication request.`,
          fromUserId: user!.id,
          fromDepartment: 0,
          toDepartment: 3,
          toUserIds: pharmacists.map((u: any) => u.id),
        });

      } else {
        toast.warning("No pharmacists available to notify. Please follow up with the pharmacy department manually.");
      }

      onOpenChange(false)
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[900px] w-full overflow-y-auto px-8 py-4">
        <SheetHeader className="p-0">
          <SheetTitle>Prescribe Medication</SheetTitle>
          <SheetDescription>Fill in the prescription details below.</SheetDescription>
        </SheetHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Drug Name</Label>
            <Input value={drugName} onChange={(e) => setDrugName(e.target.value)} />
            {errors.drugName && <p className="text-red-500 text-sm">{errors.drugName}</p>}
          </div>
          <div className="grid gap-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {errors.quantity && <p className="text-sm text-red-500">{errors.quantity}</p>}
          </div>
          <div className="grid gap-2">
            <Label>Dosage</Label>
            <Input value={medicineDosage} onChange={(e) => setMedicineDosage(e.target.value)} />
            {errors.medicineDosage && <p className="text-sm text-red-500">{errors.medicineDosage}</p>}
          </div>
          <div className="grid gap-2">
            <Label>Comments</Label>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Any notes or instructions..."
            />
          </div>
        </div>
        <div>
          <SheetFooter className="flex flex-row p-0">
            <SheetClose asChild>
              <Button variant="outline">Cancel</Button>
            </SheetClose>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default PrescriptionSheet
