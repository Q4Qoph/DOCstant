import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetFooter,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { PrescriptionRecord } from "@/types"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface ActionSheetProps {
    isOpen: boolean
    onClose: () => void
    prescription: PrescriptionRecord | null
    action: "approve" | "reject"
    onSubmit: (comment: string) => void
    isLoading: boolean
}

const ActionSheet = ({
    isOpen,
    onClose,
    prescription,
    action,
    onSubmit,
    isLoading,
}: ActionSheetProps) => {
    const [comment, setComment] = useState("")

    const handleSubmit = () => {
        onSubmit(comment)
        setComment("")
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="right" className="w-[500px] sm:w-[800px] overflow-y-auto px-8 py-4">
                <SheetHeader className="p-0">
                    <SheetTitle>
                        {action === "approve" ? "Approve" : "Reject"} Prescription
                    </SheetTitle>
                    <SheetDescription>
                        {prescription && (
                            <>
                                Patient: <strong>{prescription.record?.name}</strong>
                                <br />
                                Drug: <strong>{prescription.drugName}</strong> (
                                {prescription.medicineDosage})
                            </>
                        )}
                    </SheetDescription>
                </SheetHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea
                            id="comment"
                            placeholder={`Add a comment for ${action}ing this prescription...`}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                </div>

                <SheetFooter className="mt-auto flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={
                            action === "approve"
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-red-600 hover:bg-red-700"
                        }
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {action === "approve" ? "Approve" : "Reject"}
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default ActionSheet
