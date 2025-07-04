
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreditCard, DollarSign, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ExpenseForm from "../../(components)/ExpenseForm";

const getExpenses = (diagnosisId: string) => api.get(`/api/Expense/${diagnosisId}`);
const createExpense = (data: { expenseName: string; amount: number; diagnosisId: string }) =>
    api.post('/api/Expense', data);
const createPayment = (diagnosisId: string): Promise<{ data: any }> =>
    api.post(`/api/Payment/${diagnosisId}`, {
        "approvedURL": "http://localhost:3000/dashboard/payment/success",
        "cancelURL": "http://localhost:3000/dashboard/payment/cancelled"
    });

const Expenses = ({ id }: { id: any }) => {
    const [expenseOpen, setExpenseOpen] = useState(false);
    const queryClient = useQueryClient();
    const {
        data: expenses,
        isLoading: expensesLoading,
    } = useQuery({
        queryKey: ["expenses", id],
        queryFn: () => getExpenses(id as string).then((res) => res.data),
        enabled: !!id,
    });


    const createExpenseMutation = useMutation({
        mutationFn: createExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses", id] });
            setExpenseOpen(false);
        },
    });

    const createPaymentMutation = useMutation({
        mutationFn: () => createPayment(id as string),
        onSuccess: (response) => {
            window.location.href = response.data.url;
        },
        onError: (error) => {
            console.error('Payment error:', error);
            toast.error('Failed to initiate payment. Please try again.');
        },
    });

    const handlePayment = () => {
        if (!expenses || expenses.length === 0) {
            toast.error('No expenses to pay for this patient.');
            return;
        }
        createPaymentMutation.mutate();
    };

    const totalAmount = expenses?.reduce((sum: number, expense: any) => sum + expense.amount, 0) || 0;

    return (
        <TabsContent value="expenses">
            <Card className="shadow-none">
                <CardHeader className="flex justify-between border-b">
                    <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Expenses ({expenses?.length || 0})
                        {expenses && expenses.length > 0 && (
                            <Badge className="bg-blue-100 text-blue-800 border-blue-300 ml-2">
                                Total: ${totalAmount.toFixed(2)}
                            </Badge>
                        )}
                    </CardTitle>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => setExpenseOpen(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Expense
                        </Button>

                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {expensesLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                    ) : expenses && expenses.length > 0 ? (
                        <div className="space-y-4">
                            {expenses.map((expense: any, index: number) => (
                                <div key={expense.id} className="p-4 rounded-lg border">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-semibold text-lg">{expense.expenseName}</h4>
                                        <Badge className="bg-green-100 text-green-800 border-green-300 text-lg font-semibold">
                                            ${expense.amount.toFixed(2)}
                                        </Badge>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Expense #{index + 1} • ID: {expense.id}
                                    </div>
                                </div>
                            ))}
                            <div className="mt-6 p-4 rounded-lg border bg-gray-50">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold">Total Amount:</span>
                                    <span className="text-2xl font-bold">
                                        ${totalAmount.toFixed(2)}
                                    </span>
                                </div>
                                <div className="mt-3 flex justify-end">
                                    <Button
                                        onClick={handlePayment}
                                        disabled={createPaymentMutation.isPending}
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                        {createPaymentMutation.isPending ? (
                                            <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                                        ) : (
                                            <CreditCard className="h-4 w-4 mr-2" />
                                        )}
                                        {createPaymentMutation.isPending ? 'Processing Payment...' : 'Pay with Stripe'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No expenses recorded yet</p>
                            <Button
                                onClick={() => setExpenseOpen(true)}
                                variant="outline"
                                className="mt-3"
                            >
                                Add First Expense
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <ExpenseForm
                open={expenseOpen}
                onOpenChange={setExpenseOpen}
                diagnosisId={id as string}
                onSubmit={(data) => createExpenseMutation.mutate(data)}
                isLoading={createExpenseMutation.isPending}
            />
        </TabsContent>

    )
}

export default Expenses