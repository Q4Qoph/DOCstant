// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Loader2, DollarSign } from "lucide-react";

// interface ExpenseFormProps {
//     open: boolean;
//     onOpenChange: (open: boolean) => void;
//     diagnosisId: string;
//     onSubmit: (data: { expenseName: string; amount: number; diagnosisId: string }) => void;
//     isLoading?: boolean;
// }

// const ExpenseForm = ({ 
//     open, 
//     onOpenChange, 
//     diagnosisId, 
//     onSubmit, 
//     isLoading = false 
// }: ExpenseFormProps) => {
//     const [expenseName, setExpenseName] = useState("");
//     const [amount, setAmount] = useState("");
//     const [errors, setErrors] = useState<{ expenseName?: string; amount?: string }>({});

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
        
//         // Validation
//         const newErrors: { expenseName?: string; amount?: string } = {};
        
//         if (!expenseName.trim()) {
//             newErrors.expenseName = "Expense name is required";
//         }
        
//         if (!amount.trim()) {
//             newErrors.amount = "Amount is required";
//         } else {
//             const numAmount = parseFloat(amount);
//             if (isNaN(numAmount)) {
//                 newErrors.amount = "Amount must be a valid number";
//             } else if (numAmount <= 0) {
//                 newErrors.amount = "Amount must be greater than 0";
//             }
//         }
        
//         setErrors(newErrors);
        
//         if (Object.keys(newErrors).length === 0) {
//             onSubmit({
//                 expenseName: expenseName.trim(),
//                 amount: parseFloat(amount),
//                 diagnosisId,
//             });
//         }
//     };

//     const handleClose = () => {
//         setExpenseName("");
//         setAmount("");
//         setErrors({});
//         onOpenChange(false);
//     };

//     const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         // Allow only numbers and decimal point
//         if (value === "" || /^\d*\.?\d*$/.test(value)) {
//             setAmount(value);
//         }
//     };

//     return (
//         <Dialog open={open} onOpenChange={handleClose}>
//             <DialogContent className="sm:max-w-[400px]">
//                 <DialogHeader>
//                     <DialogTitle className="flex items-center gap-2">
//                         <DollarSign className="h-5 w-5 text-green-500" />
//                         Add New Expense
//                     </DialogTitle>
//                     <DialogDescription>
//                         Record a new expense for this patient's treatment.
//                     </DialogDescription>
//                 </DialogHeader>
                
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="expenseName">Expense Name *</Label>
//                         <Input
//                             id="expenseName"
//                             placeholder="e.g., X-Ray, Lab Test, Medication, Consultation"
//                             value={expenseName}
//                             onChange={(e) => setExpenseName(e.target.value)}
//                             className={errors.expenseName ? 'border-red-500' : ''}
//                             disabled={isLoading}
//                         />
//                         {errors.expenseName && (
//                             <p className="text-sm text-red-500">{errors.expenseName}</p>
//                         )}
//                     </div>

//                     <div className="space-y-2">
//                         <Label htmlFor="amount">Amount ($) *</Label>
//                         <div className="relative">
//                             <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                             <Input
//                                 id="amount"
//                                 placeholder="0.00"
//                                 value={amount}
//                                 onChange={handleAmountChange}
//                                 className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
//                                 disabled={isLoading}
//                             />
//                         </div>
//                         {errors.amount && (
//                             <p className="text-sm text-red-500">{errors.amount}</p>
//                         )}
//                     </div>

//                     {/* Preview */}
//                     {expenseName && amount && !errors.amount && (
//                         <div className="p-3 bg-green-50 rounded-lg border border-green-200">
//                             <div className="flex justify-between items-center">
//                                 <span className="font-medium text-green-800">{expenseName}</span>
//                                 <span className="font-bold text-green-900">${parseFloat(amount || "0").toFixed(2)}</span>
//                             </div>
//                         </div>
//                     )}
                    
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
//                             className="bg-green-500 hover:bg-green-600"
//                             disabled={isLoading}
//                         >
//                             {isLoading ? (
//                                 <>
//                                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
//                                     Adding Expense...
//                                 </>
//                             ) : (
//                                 <>
//                                     <DollarSign className="h-4 w-4 mr-2" />
//                                     Add Expense
//                                 </>
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default ExpenseForm;


"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Loader2, DollarSign } from "lucide-react";

interface ExpenseFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    diagnosisId: string;
    onSubmit: (data: { expenseName: string; amount: number; diagnosisId: string }) => void;
    isLoading?: boolean;
}

const ExpenseForm = ({ 
    open, 
    onOpenChange, 
    diagnosisId, 
    onSubmit, 
    isLoading = false 
}: ExpenseFormProps) => {
    const [expenseName, setExpenseName] = useState("");
    const [amount, setAmount] = useState("");
    const [errors, setErrors] = useState<{ expenseName?: string; amount?: string }>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation
        const newErrors: { expenseName?: string; amount?: string } = {};
        
        if (!expenseName.trim()) {
            newErrors.expenseName = "Expense name is required";
        }
        
        if (!amount.trim()) {
            newErrors.amount = "Amount is required";
        } else {
            const numAmount = parseFloat(amount);
            if (isNaN(numAmount)) {
                newErrors.amount = "Amount must be a valid number";
            } else if (numAmount <= 0) {
                newErrors.amount = "Amount must be greater than 0";
            }
        }
        
        setErrors(newErrors);
        
        if (Object.keys(newErrors).length === 0) {
            onSubmit({
                expenseName: expenseName.trim(),
                amount: parseFloat(amount),
                diagnosisId,
            });
        }
    };

    const handleClose = () => {
        setExpenseName("");
        setAmount("");
        setErrors({});
        onOpenChange(false);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Allow only numbers and decimal point
        if (value === "" || /^\d*\.?\d*$/.test(value)) {
            setAmount(value);
        }
    };

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent className="sm:max-w-[900px] w-full overflow-y-auto px-8 py-4 ">
                <SheetHeader className="p-0">
                    <SheetTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-blue-500" />
                        Add New Expense
                    </SheetTitle>
                    <SheetDescription>
                        Record a new expense for this patient's treatment.
                    </SheetDescription>
                </SheetHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    <div className="space-y-2">
                        <Label htmlFor="expenseName">Expense Name *</Label>
                        <Input
                            id="expenseName"
                            placeholder="e.g., X-Ray, Lab Test, Medication, Consultation"
                            value={expenseName}
                            onChange={(e) => setExpenseName(e.target.value)}
                            className={errors.expenseName ? 'border-red-500' : ''}
                            disabled={isLoading}
                        />
                        {errors.expenseName && (
                            <p className="text-sm text-red-500">{errors.expenseName}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount ($) *</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                id="amount"
                                placeholder="0.00"
                                value={amount}
                                onChange={handleAmountChange}
                                className={`pl-10 ${errors.amount ? 'border-red-500' : ''}`}
                                disabled={isLoading}
                            />
                        </div>
                        {errors.amount && (
                            <p className="text-sm text-red-500">{errors.amount}</p>
                        )}
                    </div>

                    {/* Preview */}
                    {expenseName && amount && !errors.amount && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex justify-between items-center">
                                <span className="font-medium text-green-800">{expenseName}</span>
                                <span className="font-bold text-green-900">${parseFloat(amount || "0").toFixed(2)}</span>
                            </div>
                        </div>
                    )}
                    
                    <SheetFooter className="flex flex-row mt-6 p-0">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="w-fit"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-fit bg-blue-500 hover:bg-blue-600"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Adding Expense...
                                </>
                            ) : (
                                <>
                                    <DollarSign className="h-4 w-4 mr-2" />
                                    Add Expense
                                </>
                            )}
                        </Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
};

export default ExpenseForm;