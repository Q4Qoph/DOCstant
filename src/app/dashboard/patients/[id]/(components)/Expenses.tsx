"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs" // Updated import
import { Separator } from "@/components/ui/separator"
import api from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CreditCard, DollarSign, Plus, Bitcoin, History, Wallet, Receipt } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import ExpenseForm from "../../(components)/ExpenseForm"

const getExpenses = (diagnosisId: string) => api.get(`/api/Expense/${diagnosisId}`)
const getPayments = (diagnosisId: string) => api.get(`/api/Payment/${diagnosisId}`)

const createExpense = (data: { expenseName: string; amount: number; diagnosisId: string }) =>
    api.post("/api/Expense", data)

const createPayment = (diagnosisId: string): Promise<{ data: any }> =>
    api.post(`/api/Payment/${diagnosisId}`, {
        approvedURL: "http://localhost:3000/dashboard/payment/success",
        cancelURL: "http://localhost:3000/dashboard/payment/cancelled",
    })

const createCryptoPayment = (diagnosisId: string): Promise<{ data: any }> =>
    api.post(`/api/Payment/crypto/${diagnosisId}`, {
        successURL: "http://localhost:3000/dashboard/payment/crypto-success",
        cancelURL: "http://localhost:3000/dashboard/payment/crypto-cancelled",
    })

const Expenses = ({ id }: { id: any }) => {
    const [expenseOpen, setExpenseOpen] = useState(false)
    const queryClient = useQueryClient()

    const { data: expenses, isLoading: expensesLoading } = useQuery({
        queryKey: ["expenses", id],
        queryFn: () => getExpenses(id as string).then((res) => res.data),
        enabled: !!id,
    })

    const { data: payments, isLoading: paymentsLoading } = useQuery({
        queryKey: ["payments", id],
        queryFn: () => getPayments(id as string).then((res) => res.data),
        enabled: !!id,
    })

    const createExpenseMutation = useMutation({
        mutationFn: createExpense,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expenses", id] })
            setExpenseOpen(false)
        },
    })

    const createPaymentMutation = useMutation({
        mutationFn: () => createPayment(id as string),
        onSuccess: (response) => {
            window.location.href = response.data.url
        },
        onError: (error) => {
            console.error("Payment error:", error)
            toast.error("Failed to initiate payment. Please try again.")
        },
    })

    const createCryptoPaymentMutation = useMutation({
        mutationFn: () => createCryptoPayment(id as string),
        onSuccess: (response) => {
            window.location.href = response.data.url
        },
        onError: (error) => {
            console.error("Crypto payment error:", error)
            toast.error("Feature coming soon!")
        },
    })

    const handleStripePayment = () => {
        if (!expenses || expenses.length === 0) {
            toast.error("No expenses to pay for this patient.")
            return
        }
        createPaymentMutation.mutate()
    }

    const handleCryptoPayment = () => {
        if (!expenses || expenses.length === 0) {
            toast.error("No expenses to pay for this patient.")
            return
        }
        createCryptoPaymentMutation.mutate()
    }

    const totalAmount = expenses?.reduce((sum: number, expense: any) => sum + expense.amount, 0) || 0
    const totalPaid = payments
        ? payments.prescriptionsCost + payments.labTestCost + payments.inpatientCost + payments.expenseCost
        : 0

    return (
        <Tabs defaultValue="expenses" className="space-y-6">
            {" "}
            {/* Updated component */}
            <TabsContent value="expenses" className="space-y-6">
                {/* Expenses Section */}
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
                            <Button onClick={() => setExpenseOpen(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
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

                                {/* Payment Section */}
                                <div className="mt-6 p-6 rounded-lg border bg-gradient-to-br from-gray-50 to-gray-100">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-semibold">Total Amount:</span>
                                        <span className="text-2xl font-bold text-green-600">${totalAmount.toFixed(2)}</span>
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="space-y-3">
                                        <p className="text-sm text-gray-600 mb-3">Choose your payment method:</p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {/* Stripe Payment */}
                                            <Button
                                                onClick={handleStripePayment}
                                                disabled={createPaymentMutation.isPending}
                                                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                            >
                                                {createPaymentMutation.isPending ? (
                                                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                                                ) : (
                                                    <CreditCard className="h-5 w-5 mr-2" />
                                                )}
                                                {createPaymentMutation.isPending ? "Processing..." : "Pay with Card"}
                                            </Button>

                                            {/* Crypto Payment */}
                                            <Button
                                                onClick={handleCryptoPayment}
                                                disabled={createCryptoPaymentMutation.isPending}
                                                className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white h-12 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                                            >
                                                {createCryptoPaymentMutation.isPending ? (
                                                    <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                                                ) : (
                                                    <Bitcoin className="h-5 w-5 mr-2" />
                                                )}
                                                {createCryptoPaymentMutation.isPending ? "Processing..." : "Pay with Crypto"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No expenses recorded yet</p>
                                <Button onClick={() => setExpenseOpen(true)} variant="outline" className="mt-3">
                                    Add First Expense
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payments History Section */}
                <Card className="shadow-none">
                    <CardHeader className="border-b">
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Payment History
                            {totalPaid > 0 && (
                                <Badge className="bg-green-100 text-green-800 border-green-300 ml-2">
                                    Total Paid: ${totalPaid.toFixed(2)}
                                </Badge>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {paymentsLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                            </div>
                        ) : payments && totalPaid > 0 ? (
                            <div className="space-y-4">
                                {/* Payment Breakdown */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* {payments.prescriptionsCost > 0 && ( */}
                                        <div className="p-4 rounded-lg border bg-blue-50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Receipt className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm font-medium text-blue-800">Prescriptions</span>
                                            </div>
                                            <div className="text-xl font-bold text-blue-900">${payments.prescriptionsCost.toFixed(2)}</div>
                                        </div>
                                    {/* )} */}

                                    {/* {payments.labTestCost > 0 && ( */}
                                        <div className="p-4 rounded-lg border bg-purple-50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Receipt className="h-4 w-4 text-purple-600" />
                                                <span className="text-sm font-medium text-purple-800">Lab Tests</span>
                                            </div>
                                            <div className="text-xl font-bold text-purple-900">${payments.labTestCost.toFixed(2)}</div>
                                        </div>
                                    {/* )} */}

                                    {/* {payments.inpatientCost > 0 && ( */}
                                        <div className="p-4 rounded-lg border bg-red-50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Receipt className="h-4 w-4 text-red-600" />
                                                <span className="text-sm font-medium text-red-800">Admission</span>
                                            </div>
                                            <div className="text-xl font-bold text-red-900">${payments.inpatientCost.toFixed(2)}</div>
                                        </div>
                                    {/* )} */}

                                    {payments.expenseCost > 0 && (
                                        <div className="p-4 rounded-lg border bg-green-50">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Receipt className="h-4 w-4 text-green-600" />
                                                <span className="text-sm font-medium text-green-800">Expenses</span>
                                            </div>
                                            <div className="text-xl font-bold text-green-900">${payments.expenseCost.toFixed(2)}</div>
                                        </div>
                                    )}
                                </div>

                                {/* Total Summary */}
                                <div className="mt-6 p-4 rounded-lg border bg-gradient-to-r from-green-50 to-emerald-50">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <Wallet className="h-5 w-5 text-green-600" />
                                            <span className="text-lg font-semibold text-green-800">Total Paid:</span>
                                        </div>
                                        <span className="text-2xl font-bold text-green-900">${totalPaid.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* Outstanding Balance */}
                                {totalAmount > totalPaid && (
                                    <div className="p-4 rounded-lg border bg-yellow-50">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-yellow-800">Outstanding Balance:</span>
                                            <span className="text-2xl font-bold text-yellow-900">
                                                ${(totalAmount - totalPaid).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                <p>No payments recorded yet</p>
                                <p className="text-sm mt-1">Payments will appear here once processed</p>
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
        </Tabs>
    )
}

export default Expenses
