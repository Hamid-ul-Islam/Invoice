'use client'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { type MouseEventHandler } from 'react'
import InvoiceForm from './Form'

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
	interface jsPDF {
		autoTable: (options: any) => any
		lastAutoTable: {
			finalY: number
		}
	}
}

interface Item {
	description: string
	price: number
	quantity: number
}

interface PaymentSlipProps {
	clientName?: string
	mobileNumber?: string
	pageName?: string
	bkashAccountLastDigit?: string
	bkashTrxId?: string
	orderNo?: string
	paymentDate?: string
	paymentMethod?: string
	bankAccountNo?: string
	accountName?: string
	items?: Item[]
}

const Invoice: React.FC<PaymentSlipProps> = () => {
	const generatePDF = ({
		clientName,
		mobileNumber,
		pageName,
		bkashAccountLastDigit,
		bkashTrxId,
		orderNo,
		paymentDate,
		paymentMethod,
		bankAccountNo,
		accountName,
		items,
	}: PaymentSlipProps) => {
		const doc = new jsPDF('p', 'mm', 'a4')
		const pageWidth = doc.internal.pageSize.getWidth()
		const pageHeight = doc.internal.pageSize.getHeight()

		// Add header
		doc.setFontSize(14)
		doc.addImage('/header.png', 'PNG', 0, 0, pageWidth, 20)
		doc.addImage('/badge.png', 'PNG', 36, 20, 30, 30)
		doc.setFont('helvetica', 'bold')
		doc.setFontSize(18)
		doc.text('UL FATH ADS AGENCY', 20, 55)
		doc.addImage('/paid.png', 'PNG', pageWidth - 60, 23, 40, 40)
		doc.setFont('helvetica', 'normal')
		doc.setFontSize(10)

		// Add client and order details in two columns
		doc.setFontSize(12)
		doc.text(`CLIENT NAME: ${clientName}`, 20, 70)
		doc.text(`Mobile Number: ${mobileNumber}`, 100, 70)
		doc.text(`Page Name: ${pageName}`, 20, 78)
		doc.text(`Bkash Account Last Digit: ${bkashAccountLastDigit}`, 100, 78)
		doc.text(`Bkash Trx ID: ${bkashTrxId}`, 20, 86)
		doc.text(`Order No: ${orderNo}`, 100, 86)
		doc.text(`Payment Date: ${paymentDate}`, 20, 94)
		doc.text(`Payment Method: ${paymentMethod}`, 100, 94)
		doc.text(`Bank Account No: ${bankAccountNo}`, 20, 102)
		doc.text(`Account Name: ${accountName}`, 100, 102)

		// Add table of items
		doc.autoTable({
			startY: 115,
			margin: { left: 20 },
			head: [['DESCRIPTION', 'PRICE', 'QTY', 'SUBTOTAL']],
			body: items?.map(item => [
				item.description,
				item.price,
				item.quantity,
				(item.price * item.quantity).toFixed(2),
			]),
			styles: {
				fontStyle: 'bold',
				fontSize: 12,
				cellPadding: 2,
			},
			headStyles: {
				fillColor: [255, 215, 0],
				textColor: [0, 0, 0],
			},
			bodyStyles: {
				fontSize: 11,
			},
		})

		// Calculate total amount
		const totalAmount = items?.reduce(
			(acc, item) => acc + item.price * item.quantity,
			0,
		)

		// Create amount calculation table
		const amountTableX = pageWidth - 80 // Position table 80mm from right edge
		doc.autoTable({
			startY: doc.lastAutoTable.finalY + 5,
			margin: { left: amountTableX },
			head: [['Amount Calculation', '']],
			body: [
				['Sub-total :', totalAmount?.toFixed(2)],
				['Charge :', '0.00'],
				['Due :', '0.00'],
				['Total :', totalAmount?.toFixed(2)],
			],
			styles: {
				fontSize: 11,
				cellPadding: 2,
			},
			headStyles: {
				fillColor: [245, 245, 245],
				textColor: [0, 0, 0],
				padding: 1,
			},
			columnStyles: {
				0: { fontStyle: 'bold' },
				1: { halign: 'right' },
			},
			theme: 'plain',
		})

		// seal
		doc.addImage('/seal.png', 'PNG', 30, pageHeight - 130, 54, 40)
		doc.addImage('/social.png', 'PNG', 20, pageHeight - 80, 70, 23)
		// Add agency CEO signature
		doc.addImage(
			'/signature.png',
			'PNG',
			pageWidth - 80,
			pageHeight - 50,
			60,
			30,
		)
		// footer
		doc.addImage('/footer.png', 'PNG', 0, pageHeight - 20, pageWidth, 20)

		doc.save('payment-slip.pdf')
	}

	return (
		<div className="w-full flex justify-center items-center">
			<InvoiceForm generate={generatePDF} />
		</div>
	)
}

export default Invoice
