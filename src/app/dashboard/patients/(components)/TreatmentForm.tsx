// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Loader2, Stethoscope } from "lucide-react";

// interface TreatmentFormProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     diagnosisId: string;
//     onSubmit: (data: { diagnosisId: string; description: string }) => void;
//     isLoading?: boolean;
// }

// const TreatmentForm = ({ 
//     open, 
//     onOpenChange, 
//     diagnosisId, 
//     onSubmit, 
//     isLoading = false 
// }: TreatmentFormProps) => {
//     const [description, setDescription] = useState("");
//     const [errors, setErrors] = useState<{ description?: string }>({});

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
        
//         // Validation
//         const newErrors: { description?: string } = {};
        
//         if (!description.trim()) {
//             newErrors.description = "Treatment description is required";
//         }
        
//         setErrors(newErrors);
        
//         if (Object.keys(newErrors).length === 0) {
//             onSubmit({
//                 diagnosisId,
//                 description: description.trim(),
//             });
//         }
//     };

//     const handleClose = () => {
//         setDescription("");
//         setErrors({});
//         onOpenChange(false);
//     };

//     return (
//         <Dialog open={open} onOpenChange={handleClose}>
//             <DialogContent className="sm:max-w-[500px]">
//                 <DialogHeader>
//                     <DialogTitle className="flex items-center gap-2">
//                         <Stethoscope className="h-5 w-5 text-blue-500" />
//                         Add New Treatment
//                     </DialogTitle>
//                     <DialogDescription>
//                         Add a new treatment plan for this patient. Provide detailed instructions and recommendations.
//                     </DialogDescription>
//                 </DialogHeader>
                
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="description">Treatment Description *</Label>
//                         <Textarea
//                             id="description"
//                             placeholder="Enter detailed treatment description, including medications, procedures, instructions, and recommendations..."
//                             value={description}
//                             onChange={(e) => setDescription(e.target.value)}
//                             className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
//                             disabled={isLoading}
//                         />
//                         {errors.description && (
//                             <p className="text-sm text-red-500">{errors.description}</p>
//                         )}
//                     </div>
                    
//                     <DialogFooter>
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={handleClose}
//                             disabled={isLoading}
//                         >
//                             Cancel
//                         </Button>
//                         <Button
//                             type="submit"
//                             className="bg-blue-500 hover:bg-blue-600"
//                             disabled={isLoading}
//                         >
//                             {isLoading ? (
//                                 <>
//                                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                     Adding Treatment...
//                                 </>
//                             ) : (
//                                 <>
//                                     <Stethoscope className="h-4 w-4 mr-2" />
//                                     Add Treatment
//                                 </>
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default TreatmentForm;


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Loader2, Stethoscope } from "lucide-react";

interface TreatmentFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    diagnosisId: string;
    onSubmit: (data: { diagnosisId: string; description: string }) => void;
    isLoading?: boolean;
}

const TreatmentForm = ({ 
    open, 
    onOpenChange, 
    diagnosisId, 
    onSubmit, 
    isLoading = false 
}: TreatmentFormProps) => {
    const [description, setDescription] = useState("");
    const [errors, setErrors] = useState<{ description?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        const newErrors: { description?: string } = {};
        
        if (!description.trim()) {
            newErrors.description = "Treatment description is required";
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            onSubmit({
                diagnosisId,
                description: description.trim(),
            });
        }
    };

    const handleClose = () => {
        setDescription("");
        setErrors({});
        onOpenChange(false);
    };

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent className="sm:max-w-[900px] w-full overflow-y-auto px-8 py-4">
                <SheetHeader className="p-0">
                    <SheetTitle className="flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-blue-500" />
                        Add New Treatment
                    </SheetTitle>
                    <SheetDescription>
                        Add a new treatment plan for this patient. Provide detailed instructions and recommendations.
                    </SheetDescription>
                </SheetHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="description">Treatment Description *</Label>
                        <Textarea
                            id="description"
                            placeholder="Enter detailed treatment description, including medications, procedures, instructions, and recommendations..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`min-h-[120px] ${errors.description ? 'border-red-500' : ''}`}
                            disabled={isLoading}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>
                    
                    <SheetFooter className="flex flex-row mt-6 p-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Adding Treatment...
                                </>
                            ) : (
                                <>
                                    <Stethoscope className="h-4 w-4 mr-2" />
                                    Add Treatment
                                </>
                            )}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default TreatmentForm;