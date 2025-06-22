import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { PrescriptionRecord } from "@/types"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface ActionModalProps {
    isOpen: boolean
    onClose: () => void
    prescription: PrescriptionRecord | null
    action: "approve" | "reject"
    onSubmit: (comment: string) => void
    isLoading: boolean
}

const ActionModal = ({ isOpen, onClose, prescription, action, onSubmit, isLoading }: ActionModalProps) => {
    const [comment, setComment] = useState("")

    const handleSubmit = () => {
        onSubmit(comment)
        setComment("")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {action === "approve" ? "Approve" : "Reject"} Prescription
                    </DialogTitle>
                    <DialogDescription>
                        {prescription && (
                            <>
                                Patient: <strong>{prescription.record?.name}</strong>
                                <br />
                                Drug: <strong>{prescription.drugName}</strong> ({prescription.medicineDosage})
                            </>
                        )}
                    </DialogDescription>
                </DialogHeader>
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
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={action === "approve" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {action === "approve" ? "Approve" : "Reject"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ActionModal