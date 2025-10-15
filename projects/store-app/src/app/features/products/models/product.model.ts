export interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  description: string;
  category: Category;
  rating?: RatingModel;
  loading?: boolean;
}

export interface RatingModel {
  rate: number;
  count: number;
}

export type Category = 'electronics' | 'jewelery' | "men's clothing" | "women's clothing" | 'all';

export interface ProductsState {
  allProducts: Product[] | null;
  products: Product[];
  categories: Category[];
  productToEdit: Product | null;
  searchTerm: string;
}

export interface ProductListModel {
  loading?: boolean;
  products: Product[];
}

export const PRODUCTS_CONSTANTS = {
  SEARCH_DEBOUNCE_TIME: 300,
  SEARCH_API_DELAY: 300,
  TOAST_DURATION: 3000,
  DEFAULT_IMAGE: 'assets/images/empty-image.jpg',
  TOAST_MESSAGES: {
    LOAD_ERROR: 'Falha ao carregar os produtos, tente novamente.',
    CATEGORIES_ERROR: 'Falha ao carregar as categorias, tente novamente.',
    CREATE_SUCCESS: 'Produto criado com sucesso.',
    UPDATE_SUCCESS: 'Produto atualizado com sucesso.',
    CREATE_ERROR: 'Falha ao criar o produto, tente novamente.',
    UPDATE_ERROR: 'Falha ao atualizar o produto, tente novamente.',
    DELETE_SUCCESS: 'Produto excluído com sucesso.',
    DELETE_ERROR: 'Falha ao excluir o produto, tente novamente.'
  },
  TOAST_TYPES: {
    SUCCESS: 'success',
    ERROR: 'error'
  }
} as const;
