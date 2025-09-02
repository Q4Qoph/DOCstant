import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Treatment } from "@/types"

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

export async function printPatientReport(patient: any, treatments: Treatment[], expenses: any[], diagnosisId: string, logoPath = "/logo.png") {
    const themeColor = "#0c9aff"
    const doc = new jsPDF()

    // Load logo
    let logoBase64: string | undefined
    try {
        logoBase64 = await getBase64FromUrl(logoPath)
    } catch {
        console.warn("Logo could not be loaded")
    }

    // === Header ===
    if (logoBase64) {
        doc.addImage(logoBase64, "PNG", 14, 5, 40, 20)
    }
    doc.setFontSize(18)
    doc.setTextColor(themeColor)
    doc.text("Patient Medical Report", 105, 20, { align: "center" })

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.text(`Patient: ${patient?.name || ""}`, 14, 35)
    doc.text(`ID Number: ${patient?.idNumber || ""}`, 14, 42)
    doc.text(`Sex: ${patient?.sex || ""} • Age: ${patient?.age || ""}`, 14, 49)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 42)

    let currentY = 60
    // === Contact Information ===
    doc.setFontSize(14)
    doc.setTextColor(themeColor)
    doc.text("Contact Information", 14, currentY)

    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text(`Phone: ${patient.phoneNumber || "N/A"}`, 14, currentY + 7)
    doc.text(`Address: ${patient.address || "N/A"}`, 14, currentY + 14)
    currentY += 25

    // === Vital Signs ===
    doc.setFontSize(14)
    doc.setTextColor(themeColor)
    doc.text("Vital Signs", 14, currentY)

    autoTable(doc, {
        startY: currentY + 5,
        head: [["Blood Pressure", "Temperature", "Heart Rate", "Respiratory Rate", "Weight", "Height"]],
        body: [[
            patient.bloodPresure || "N/A",
            patient.temperature || "N/A",
            patient.heartRate || "N/A",
            patient.respiratoryRate || "N/A",
            patient.weight || "N/A",
            patient.height || "N/A",
        ]],
        styles: { fontSize: 11 },
        headStyles: { fillColor: themeColor, textColor: 255 },
    })
    currentY = (doc as any).lastAutoTable.finalY + 10

    // === Chief Complaint ===
    if (patient?.chiefComplaint) {
        doc.setFontSize(14)
        doc.setTextColor(themeColor)
        doc.text("Chief Complaint", 14, currentY)
        doc.setFontSize(11)
        doc.setTextColor(0, 0, 0)

        const wrappedComplaint = doc.splitTextToSize(patient.chiefComplaint, 180)
        doc.text(wrappedComplaint, 14, currentY + 7)

        currentY += wrappedComplaint.length * 6 + 15
    }

    // === Current Symptoms ===
    if (patient?.symptoms) {
        doc.setFontSize(14)
        doc.setTextColor(themeColor)
        doc.text("Current Symptoms", 14, currentY)
        doc.setFontSize(11)
        doc.setTextColor(0, 0, 0)
        doc.text(patient.symptoms, 14, currentY + 7, { maxWidth: 180 })



        const wrappedSymptoms = doc.splitTextToSize(patient.symptoms, 180)
        doc.text(wrappedSymptoms, 14, currentY + 7)

        currentY += wrappedSymptoms.length * 6 + 15
    }

    // === Medical History ===
    if (patient?.medicalHistory) {
        doc.setFontSize(14)
        doc.setTextColor(themeColor)
        doc.text("Medical History", 14, currentY)
        doc.setFontSize(11)
        doc.setTextColor(0, 0, 0)
        doc.text(patient.medicalHistory, 14, currentY + 7, { maxWidth: 180 })

        const wrappedHistory = doc.splitTextToSize(patient.medicalHistory, 180)
        doc.text(wrappedHistory, 14, currentY + 7)

        currentY += wrappedHistory.length * 6 + 15

    }

    // === Treatments ===
    if (treatments?.length) {
        doc.setFontSize(14)
        doc.setTextColor(themeColor)
        doc.text("Treatments", 14, currentY)
        autoTable(doc, {
            startY: currentY + 5,
            head: [["#", "Description"]],
            body: treatments.map((t, i) => [i + 1, t.description]),
            styles: { fontSize: 11 },
            headStyles: { fillColor: themeColor, textColor: 255 },
        })
        currentY = (doc as any).lastAutoTable.finalY + 10
    }

    if (patient?.vaccinations?.length) {
        doc.setFontSize(14)
        doc.setTextColor(themeColor)
        doc.text("Vaccinations", 14, currentY)

        autoTable(doc, {
            startY: currentY + 5,
            head: [["#", "Vaccine"]],
            body: patient.vaccinations.map((v: any, i: number) => [
                i + 1,
                v.vaccineName || "N/A",
            ]),
            styles: { fontSize: 11 },
            headStyles: { fillColor: themeColor, textColor: 255 },
        })

        currentY = (doc as any).lastAutoTable.finalY + 10
    }
    // === Expenses ===
    if (expenses?.length) {
        doc.setFontSize(14)
        doc.setTextColor(themeColor)
        doc.text("Expenses", 14, currentY)
        autoTable(doc, {
            startY: currentY + 5,
            head: [["#", "Expense Name", "Amount ($)"]],
            body: expenses.map((exp: any, i: number) => [
                i + 1,
                exp.expenseName,
                exp.amount.toFixed(2),
            ]),
            styles: { fontSize: 11 },
            headStyles: { fillColor: themeColor, textColor: 255 },
        })
        currentY = (doc as any).lastAutoTable.finalY + 10
    }
    // === Lab Tests ===
    if (patient?.labTests?.length) {
        doc.setFontSize(14)
        doc.setTextColor(themeColor)
        doc.text("Lab Tests", 14, currentY)

        autoTable(doc, {
            startY: currentY + 5,
            head: [["#", "Test Name", "Date", "Cost ($)", "Result"]],
            body: patient.labTests.map((test: any, i: number) => [
                i + 1,
                test.testName || "N/A",
                test.testDate ? new Date(test.testDate).toLocaleDateString() : "N/A",
                test.cost ? `$${test.cost}` : "N/A",
                test.labTestResult || "Pending / Not Available",
            ]),
            styles: { fontSize: 11, cellWidth: 'wrap' },
            columnStyles: {
                4: { cellWidth: 60 } // make Result column wider
            },
            headStyles: { fillColor: themeColor, textColor: 255 },
        })

        currentY = (doc as any).lastAutoTable.finalY + 10
    }

    // === Footer ===
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text("Generated by Docstant• Confidential", 105, 290, {
        align: "center",
    })

    doc.save(`patient_report_${diagnosisId}.pdf`)
}
