export interface User {
	_id: string;
	name: string;
	email: string;
	role?: 'user' | 'scholar' | 'admin';
	preferences?: {
		calculationMethod?: string;
		highLatitudeRule?: string;
		timezone?: string;
	};
}