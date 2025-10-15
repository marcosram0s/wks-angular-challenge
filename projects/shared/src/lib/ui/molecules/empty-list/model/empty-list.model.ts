export interface EmptyListModel {
  message?: string;
  icon?: string;
  buttonText?: string;
}

export const EMPTY_LIST_CONSTANTS = {
  DEFAULT_MESSAGE: 'Nenhum item encontrado.',
  DEFAULT_ICON: 'search_off',
  BUTTON_TEXT: 'Tente novamente',
  BUTTON_COLOR: 'primary',
  CLEAR_BUTTON_TEXT: 'Limpar pesquisa',
  CLEAR_BUTTON_COLOR: 'secondary'
} as const;
