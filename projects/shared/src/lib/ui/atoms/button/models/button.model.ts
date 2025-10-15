export interface ButtonModel {
  text?: string;
  icon?: string;
  size: 'default' | 'full';
  color: 'primary' | 'secondary' | 'success' | 'error' | 'neutral';
  disabled: boolean;
  autoFocus: boolean;
  ariaLabel?: string;
}

export const BUTTON_CONSTANTS = {
  DEFAULT_SIZE: 'default',
  DEFAULT_COLOR: 'primary',
  SIZES: {
    DEFAULT: 'default',
    FULL: 'full'
  },
  COLORS: {
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    ERROR: 'error',
    NEUTRAL: 'neutral'
  }
} as const;
