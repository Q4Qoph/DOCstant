import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export interface ReceiptExpense {
    id: string
    expenseName: string
    amount: number
}

export interface ReceiptPayments {
    prescriptionsCost: number
    labTestCost: number
    inpatientCost: number
    expenseCost: number
}

// Convert /public image to base64
async function getBase64FromUrl(url: string): Promise<string> {
    const response = await fetch(url)
    const blob = await response.blob()
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
    })
}

export async function printReceipt(
    diagnosisId: string,
    expenses: ReceiptExpense[],
    payments: ReceiptPayments,
    logoPath: string = "/logo.png" // default logo
) {
    const themeColor = "#0c9aff"
    const totalAmount =
        payments.prescriptionsCost +
        payments.labTestCost +
        payments.inpatientCost +
        payments.expenseCost

    const doc = new jsPDF()

    // Try load logo
    let logoBase64: string | undefined
    try {
        logoBase64 = await getBase64FromUrl(logoPath)
    } catch (e) {
        console.warn("Logo could not be loaded:", e)
    }

    // === Logo & Header ===
    if (logoBase64) {
        doc.addImage(logoBase64, "PNG", 14, 5, 40, 20)
        doc.setFontSize(16)
        doc.setTextColor(themeColor)
        doc.text("Expense Receipt", 105, 20, { align: "center" })
    } else {
        doc.setFontSize(18)
        doc.setTextColor(themeColor)
        doc.text("Expense Receipt", 105, 15, { align: "center" })
    }

    // Reset text color for normal text
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.text(`Diagnosis ID: ${diagnosisId}`, 14, 35)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 35)

    // === Expenses Table ===
    autoTable(doc, {
        startY: 45,
        head: [["#", "Expense Name", "Amount ($)"]],
        body: expenses.map((exp, i) => [
            i + 1,
            exp.expenseName,
            exp.amount.toFixed(2),
        ]),
        styles: { fontSize: 11 },
        headStyles: { fillColor: themeColor, textColor: 255, halign: "center" },
    })

    // === Breakdown ===
    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 10,
        head: [["Category", "Cost ($)"]],
        body: [
            ["Prescriptions", payments.prescriptionsCost.toFixed(2)],
            ["Lab Tests", payments.labTestCost.toFixed(2)],
            ["Admission", payments.inpatientCost.toFixed(2)],
            ["Other Expenses", payments.expenseCost.toFixed(2)],
        ],
        styles: { fontSize: 11 },
        headStyles: { fillColor: themeColor, textColor: 255, halign: "center" },
    })

    // === Total Highlight ===
    doc.setFontSize(14)
    doc.setTextColor(themeColor)
    doc.text(
        `Total: $${totalAmount.toFixed(2)}`,
        14,
        (doc as any).lastAutoTable.finalY + 15
    )

    // === Footer ===
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text("Thank you for your payment.", 105, 290, { align: "center" })

    doc.save(`receipt_${diagnosisId}.pdf`)
}
