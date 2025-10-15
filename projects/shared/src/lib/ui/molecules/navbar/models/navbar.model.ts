export interface NavLink {
  path: string;
  label: string;
}

export const NAVBAR_CONSTANTS = {
  LOGO: {
    ALT: 'Logo da aplicação',
    WIDTH: 160,
    HEIGHT_RATIO: 4.65
  },
  ROUTER: {
    INDEX: '/'
  }
} as const;
