export async function startPayPalPayment(amount: number, currency: string) {
	// Placeholder: handled by backend via donateZakat
	return { status: 'succeeded', receiptUrl: '' } as { status: 'succeeded' | 'failed'; receiptUrl?: string };
}