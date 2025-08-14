import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Alert, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchZakatThresholds, donateZakat } from '../services/api';
import { setAssets, setCalculatedZakat, setPaymentFailed, setPaymentProcessing, setPaymentSuccess } from '../store/slices/zakatSlice';
import { setCurrency, setNisabThresholds } from '../store/slices/preferencesSlice';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import Constants from 'expo-constants';

function ZakatInner() {
	const dispatch = useDispatch();
	const { assets, calculatedZakat, payment } = useSelector((s: RootState) => s.zakat);
	const { currency, nisabGold, nisabSilver } = useSelector((s: RootState) => s.preferences);
	const [method, setMethod] = useState<'stripe' | 'paypal'>('stripe');
	const stripe = useStripe();

	useEffect(() => {
		(async () => {
			try {
				const t = await fetchZakatThresholds();
				dispatch(setCurrency(t.currency));
				dispatch(setNisabThresholds({ gold: t.nisab.gold, silver: t.nisab.silver }));
			} catch (e) {}
		})();
	}, [dispatch]);

	useEffect(() => {
		const totalAssets = assets.cash + assets.goldValue + assets.silverValue + assets.investments - assets.debt;
		const nisab = nisabGold ?? 0; // default to gold
		const zakat = totalAssets >= nisab ? totalAssets * 0.025 : 0;
		dispatch(setCalculatedZakat(Number(zakat.toFixed(2))));
	}, [assets, nisabGold, dispatch]);

	const handlePay = async () => {
		if (calculatedZakat <= 0) {
			Alert.alert('Zakat', 'Calculated Zakat is 0');
			return;
		}
		dispatch(setPaymentProcessing());
		try {
			if (method === 'stripe') {
				const intent = await donateZakat({ amount: calculatedZakat, currency, method: 'stripe' });
				if (intent.status === 'requires_action' && intent.clientSecret) {
					const { error, paymentIntent } = await stripe.handleNextAction({ clientSecret: intent.clientSecret });
					if (error) throw new Error(error.message);
				}
				if (intent.status === 'succeeded') {
					dispatch(setPaymentSuccess({ receiptUrl: intent.receiptUrl }));
					Alert.alert('Success', 'Payment completed');
				} else if (intent.status === 'failed') {
					throw new Error(intent.errorMessage || 'Payment failed');
				}
			} else {
				const result = await donateZakat({ amount: calculatedZakat, currency, method: 'paypal' });
				if (result.status === 'succeeded') {
					dispatch(setPaymentSuccess({ receiptUrl: result.receiptUrl }));
					Alert.alert('Success', 'Payment completed');
				} else {
					throw new Error(result.errorMessage || 'Payment failed');
				}
			}
		} catch (e: any) {
			dispatch(setPaymentFailed(e.message || 'Payment error'));
			Alert.alert('Error', e.message || 'Payment error');
		}
	};

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Zakat</Text>
			<View style={styles.row}><Text style={styles.label}>Cash</Text><TextInput keyboardType="numeric" value={String(assets.cash)} onChangeText={(t) => dispatch(setAssets({ ...assets, cash: Number(t || 0) }))} style={styles.input} /></View>
			<View style={styles.row}><Text style={styles.label}>Gold value</Text><TextInput keyboardType="numeric" value={String(assets.goldValue)} onChangeText={(t) => dispatch(setAssets({ ...assets, goldValue: Number(t || 0) }))} style={styles.input} /></View>
			<View style={styles.row}><Text style={styles.label}>Silver value</Text><TextInput keyboardType="numeric" value={String(assets.silverValue)} onChangeText={(t) => dispatch(setAssets({ ...assets, silverValue: Number(t || 0) }))} style={styles.input} /></View>
			<View style={styles.row}><Text style={styles.label}>Investments</Text><TextInput keyboardType="numeric" value={String(assets.investments)} onChangeText={(t) => dispatch(setAssets({ ...assets, investments: Number(t || 0) }))} style={styles.input} /></View>
			<View style={styles.row}><Text style={styles.label}>Debt</Text><TextInput keyboardType="numeric" value={String(assets.debt)} onChangeText={(t) => dispatch(setAssets({ ...assets, debt: Number(t || 0) }))} style={styles.input} /></View>
			<Text style={styles.total}>Calculated Zakat: {currency} {calculatedZakat.toFixed(2)}</Text>
			<View style={styles.methods}>
				<Pressable style={[styles.methodBtn, method === 'stripe' && styles.methodActive]} onPress={() => setMethod('stripe')}><Text>Stripe</Text></Pressable>
				<Pressable style={[styles.methodBtn, method === 'paypal' && styles.methodActive]} onPress={() => setMethod('paypal')}><Text>PayPal</Text></Pressable>
			</View>
			<Pressable style={styles.payBtn} onPress={handlePay}><Text style={{ color: 'white' }}>Pay</Text></Pressable>
			{payment.status === 'success' && !!payment.receiptUrl && <Text>Receipt: {payment.receiptUrl}</Text>}
		</ScrollView>
	);
}

export default function ZakatScreen() {
	const publishableKey = (Constants.expoConfig?.extra as any)?.stripePublishableKey || '';
	return (
		<StripeProvider publishableKey={publishableKey}>
			<ZakatInner />
		</StripeProvider>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16 },
	title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
	row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
	label: { width: 120 },
	input: { borderWidth: 1, borderColor: '#e5e7eb', padding: 8, borderRadius: 8, flex: 1 },
	total: { marginTop: 12, fontWeight: '700' },
	methods: { flexDirection: 'row', marginTop: 12, gap: 8 },
	methodBtn: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8 },
	methodActive: { backgroundColor: '#e0f2fe', borderColor: '#0284c7' },
	payBtn: { marginTop: 16, backgroundColor: '#0ea5e9', padding: 12, borderRadius: 8, alignItems: 'center' },
});