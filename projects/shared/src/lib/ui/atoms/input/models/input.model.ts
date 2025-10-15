export interface InputModel {
  label: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'currency';
  placeholder?: string;
  error?: string | null;
  id?: string;
  disabled?: boolean;
  mask?: string;
  prefix?: string;
  thousandSeparator?: string;
  decimalSeparator?: string;
}
