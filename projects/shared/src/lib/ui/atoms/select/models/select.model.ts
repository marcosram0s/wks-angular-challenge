export interface SelectOption<T = string | number> {
  value: T;
  label: string;
}

export interface SelectModel<T = string | number> {
  id?: string;
  label: string;
  placeholder: string;
  options: SelectOption<T>[];
  error?: string | null;
}
