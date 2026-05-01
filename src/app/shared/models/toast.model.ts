export interface ToastModel {
  message: string;
  icon?: icon;
  color?: color;
  duration?: number;
}

type icon = 'checkmark' | 'alert' | 'close';

type color = "danger" | "dark" | "light" | "medium" | "primary" | "secondary" | "success" | "tertiary" | "warning";