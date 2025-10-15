export interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  description: string;
  category: Category;
  rating?: RatingModel;
}

export interface RatingModel {
  rate: number;
  count: number;
}

export type Category = 'electronics' | 'jewelery' | "men's clothing" | "women's clothing" | 'all';

export const PRODUCT_CARD_CONSTANTS = {
  CURRENCY: 'BRL',
  TITLE_TRUNCATE_LIMIT: 20,
  PRIORITY_THRESHOLD: 9,
  ICONS: {
    EDIT: 'edit-line',
    DELETE: 'delete-bin-7-line'
  },
  COLORS: {
    PRIMARY: 'primary',
    ERROR: 'error'
  },
  IMAGE_ALT_PREFIX: 'Imagem do produto: ',
  EDIT_ARIA_PREFIX: 'Editar produto ',
  DELETE_ARIA_PREFIX: 'Excluir produto '
} as const;

export const PRODUCT_CARD_SKELETON_CONSTANTS = {
  SIZES: {
    IMAGE_FULL: '100%',
    CATEGORY_WIDTH: '40%',
    CATEGORY_HEIGHT: '0.75rem',
    TITLE_WIDTH: '80%',
    TITLE_HEIGHT: '1rem',
    PRICE_WIDTH: '50%',
    PRICE_HEIGHT: '1.5rem',
    BUTTON_SIZE: '20px'
  },
  SKELETON_SHAPE: 'rect'
} as const;
