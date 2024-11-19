'use client'

import { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Activity, PlusCircle, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import Image from 'next/image'

type FormData = {
	clientName: string
	mobileNumber: string
	pageName: string
	bkashAccountLastDigit: string
	bkashTrxId: string
	orderNo: string
	paymentDate: string
	paymentMethod: string
	bankAccountNo: string
	accountName: string
	items: { description: string; price: number; quantity: number }[]
}

export default function InvoiceForm({
	generate,
}: {
	generate: (data: FormData) => void
}) {
	const [orderNo] = useState(() => crypto.randomUUID().slice(0, 8))
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		defaultValues: {
			orderNo,
			items: [
				{ description: 'Page Setup', price: 0, quantity: 1 },
				{ description: 'Promoting Page', price: 0, quantity: 2 },
				{ description: 'Cover Logo', price: 0, quantity: 1 },
				{ description: 'Algorithm', price: 0, quantity: 1 },
			],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'items',
	})

	const onSubmit = (data: FormData) => {
		console.log(data)
		generate(data)
		// Here you would typically send the data to your backend or generate the invoice
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8 md:w-1/2">
			<Card className="md:px-10 md:py-10">
				<CardHeader>
					<CardTitle className="">
						<div className="text-xl flex flex-col justify-center items-center">
							<Image src="/badge.png" alt="logo" width={100} height={100} />
							<span>Invoice Generator</span>
							<span>UL FATH AD AGENCY</span>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="clientName">Client Name</Label>
							<Input
								id="clientName"
								{...register('clientName', {
									required: 'Client name is required',
								})}
							/>
							{errors.clientName && (
								<p className="text-sm text-red-500">
									{errors.clientName.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="mobileNumber">Mobile Number</Label>
							<Input
								id="mobileNumber"
								{...register('mobileNumber', {
									required: 'Mobile number is required',
								})}
							/>
							{errors.mobileNumber && (
								<p className="text-sm text-red-500">
									{errors.mobileNumber.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="pageName">Page Name</Label>
							<Input
								id="pageName"
								{...register('pageName', { required: 'Page name is required' })}
							/>
							{errors.pageName && (
								<p className="text-sm text-red-500">
									{errors.pageName.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="bkashAccountLastDigit">
								Bkash Account Last Digit
							</Label>
							<Input
								id="bkashAccountLastDigit"
								{...register('bkashAccountLastDigit')}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="bkashTrxId">Bkash Trx ID</Label>
							<Input id="bkashTrxId" {...register('bkashTrxId')} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="orderNo">Order No</Label>
							<Input id="orderNo" {...register('orderNo')} readOnly />
						</div>
						<div className="space-y-2">
							<Label htmlFor="paymentDate">Payment Date</Label>
							<Input
								id="paymentDate"
								type="date"
								{...register('paymentDate', {
									required: 'Payment date is required',
								})}
							/>
							{errors.paymentDate && (
								<p className="text-sm text-red-500">
									{errors.paymentDate.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="paymentMethod">Payment Method</Label>
							<Controller
								name="paymentMethod"
								control={control}
								rules={{ required: 'Payment method is required' }}
								render={({ field }: any) => (
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select payment method" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="bkash">Bkash</SelectItem>
											<SelectItem value="bank">Bank Transfer</SelectItem>
											<SelectItem value="cash">Cash</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{errors.paymentMethod && (
								<p className="text-sm text-red-500">
									{errors.paymentMethod.message}
								</p>
							)}
						</div>
						<div className="space-y-2">
							<Label htmlFor="bankAccountNo">Bank Account No</Label>
							<Input id="bankAccountNo" {...register('bankAccountNo')} />
						</div>
						<div className="space-y-2">
							<Label htmlFor="accountName">Account Name</Label>
							<Input id="accountName" {...register('accountName')} />
						</div>
					</div>

					<div className="space-y-2">
						<Label className="flex justify-between w-full">
							Serveice 🔯 Amounts 🔯 Qty
						</Label>
						{fields.map((field: any, index: number) => (
							<div key={field.id} className="flex space-x-2 items-end">
								<div className="flex-grow">
									<Input
										{...register(`items.${index}.description` as const)}
										placeholder="Description"
									/>
								</div>
								<div className="w-24">
									<Input
										{...register(`items.${index}.price` as const, {
											valueAsNumber: true,
										})}
										placeholder="Price"
										type="number"
									/>
								</div>
								<div className="w-24">
									<Input
										{...register(`items.${index}.quantity` as const, {
											valueAsNumber: true,
										})}
										placeholder="Quantity"
										type="number"
									/>
								</div>
								<Button
									type="button"
									variant="destructive"
									size="icon"
									onClick={() => remove(index)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							</div>
						))}
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => append({ description: '', price: 0, quantity: 1 })}
						>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add Item
						</Button>
					</div>
				</CardContent>
				<CardFooter>
					<Button type="submit" className="w-full text-zinc-900 font-bold py-5">
						<Activity className="mr-2 h-5 w-5" /> Generate Invoice
					</Button>
				</CardFooter>
			</Card>
		</form>
	)
}
