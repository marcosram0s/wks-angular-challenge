# 🏪 Store App - Gerenciamento de Estado com NgRx Signals

> **Aplicação Angular moderna com gerenciamento de estado reativo usando NgRx Signal Store, Feature-Sliced Architecture e sistema de Skeleton Loading avançado**

[![Angular](https://img.shields.io/badge/Angular-19.2-red?logo=angular)](https://angular.io/)
[![NgRx Signals](https://img.shields.io/badge/State-NgRx_Signals-purple)](https://ngrx.io/guide/signals)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## 📑 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura do Estado Global](#-arquitetura-do-estado-global-com-ngrx-signals)
- [Fluxo de Dados](#-fluxo-de-dados-na-aplicação)
- [Sistema de Skeleton Loading](#-sistema-de-skeleton-loading)
- [Estrutura de Componentes](#-estrutura-de-componentes)
- [Exemplos Práticos](#-exemplos-práticos)
- [Executando o Projeto](#-executando-o-projeto)

---

## 🎯 Visão Geral

O **Store App** é uma aplicação e-commerce que demonstra o uso moderno de **NgRx Signal Store** para gerenciamento de estado global, combinado com uma arquitetura baseada em **Feature-Sliced Design** e um sofisticado sistema de **Skeleton Loading**.

### Por que NgRx Signal Store?

✅ **Reatividade Granular**: Atualização automática apenas onde necessário  
✅ **Type-Safe**: Segurança de tipos em todo o fluxo de dados  
✅ **Computed Signals**: Dados derivados calculados automaticamente  
✅ **rxMethod**: Integração perfeita entre RxJS e Signals  
✅ **Menos Boilerplate**: Código mais limpo e direto  
✅ **Performance**: Change Detection otimizado

### Características Principais

🎨 **UI Reativa**: Sistema baseado em Angular Signals  
🔄 **Estado Global**: NgRx Signal Store para gerenciamento centralizado  
💀 **Skeleton Loading**: Estados de carregamento com UX superior  
🧩 **Componentes Burros**: Separação clara entre apresentação e lógica  
🎭 **Validação Assíncrona**: Preview de imagens em tempo real  
🛡️ **Interceptadores HTTP**: Tratamento centralizado de erros

---

## 🏗️ Arquitetura do Estado Global com NgRx Signals

### O que é NgRx Signal Store?

**NgRx Signal Store** é a evolução moderna do gerenciamento de estado no Angular. Ao invés de usar Actions, Reducers e Effects separados, tudo é unificado em uma estrutura declarativa e reativa baseada em **Angular Signals**.

### Estrutura do ProductsStore

O estado global de produtos é gerenciado por um **Signal Store** que centraliza todo o estado e lógica relacionada à feature.

**Localização**: `src/app/features/products/store/products.store.ts`

```typescript
export const ProductsStore = signalStore(
  { providedIn: 'root' }, // ✅ Store global singleton

  // 1️⃣ ESTADO INICIAL (withState)
  withState<ProductsState>({
    allProducts: null, // Cache de todos os produtos
    products: [], // Produtos filtrados/exibidos
    categories: [], // Categorias disponíveis
    productToEdit: null, // Produto selecionado para edição
    searchTerm: '' // Termo de busca atual
  }),

  // 2️⃣ DADOS DERIVADOS (withComputed)
  withComputed(store => ({
    // Verifica se os dados já foram carregados
    dataLoaded: computed(() => store.allProducts() !== null),

    // Filtra produtos baseado no termo de busca
    filteredProducts: computed(() => {
      const source = store.allProducts();
      const term = store.searchTerm().toLowerCase();

      if (!source || !term) return source ?? [];

      return source.filter(p => p.title.toLowerCase().includes(term));
    })
  })),

  // 3️⃣ AÇÕES (withMethods)
  withMethods((store, productService = inject(ProductService)) => ({
    // Carrega produtos da API
    loadProducts: rxMethod<void>(
      pipe(
        tap(() => skeletonStore.show()),
        switchMap(() =>
          productService.getAllProducts().pipe(
            tap(products => {
              skeletonStore.hide();
              patchState(store, {
                allProducts: products,
                products
              });
            }),
            catchError(() => {
              skeletonStore.hide();
              toastStore.show({
                type: PRODUCTS_CONSTANTS.TOAST_TYPES.ERROR,
                message: PRODUCTS_CONSTANTS.TOAST_MESSAGES.LOAD_ERROR
              });
              return of(null);
            })
          )
        )
      )
    ),

    // Define produto para edição
    setProductToEdit(product: Product | null): void {
      patchState(store, { productToEdit: product });
    },

    // Salva produto (cria ou atualiza)
    saveProduct: rxMethod<Product>(
      pipe(
        tap(() => skeletonStore.show()),
        switchMap(product => {
          const action$ = product.id ? productService.updateProduct(product) : productService.createProduct(product);

          return action$.pipe(
            switchMap(() => productService.getAllProducts()),
            tap(products => {
              skeletonStore.hide();
              patchState(store, { allProducts: products, products });
              toastStore.show({
                type: PRODUCTS_CONSTANTS.TOAST_TYPES.SUCCESS,
                message: PRODUCTS_CONSTANTS.TOAST_MESSAGES.CREATE_SUCCESS
              });
            })
          );
        })
      )
    )
  })),

  // 4️⃣ CICLO DE VIDA (withHooks)
  withHooks({
    onInit(store) {
      // Carrega dados automaticamente ao inicializar
      store.loadProducts();
      store.loadCategories();
    }
  })
);
```

### Interface do Estado

**Localização**: `src/app/features/products/models/product.model.ts`

```typescript
export interface ProductsState {
  allProducts: Product[] | null; // Cache completo (null = não carregado)
  products: Product[]; // Lista filtrada exibida na UI
  categories: Category[]; // Categorias disponíveis
  productToEdit: Product | null; // Produto em edição
  searchTerm: string; // Termo de busca atual
}

export interface Product {
  id: number;
  image: string;
  title: string;
  price: number;
  description: string;
  category: Category;
  rating?: RatingModel;
}

export type Category = 'electronics' | 'jewelery' | "men's clothing" | "women's clothing" | 'all';
```

### Stores Disponíveis na Aplicação

#### 1️⃣ ProductsStore (Feature Store)

**Localização**: `src/app/features/products/store/products.store.ts`  
**Responsabilidade**: Gerencia produtos, categorias e operações CRUD

#### 2️⃣ SkeletonStore (UI Store - Global)

**Localização**: `projects/shared/src/lib/utils/directives/skeleton/store/skeleton.store.ts`  
**Responsabilidade**: Gerencia estados de loading da aplicação

#### 3️⃣ ToastStore (UI Store - Global)

**Localização**: `projects/shared/src/lib/ui/organisms/toast/*`  
**Responsabilidade**: Notificações (sucesso, erro, aviso)

#### 4️⃣ ModalStore (UI Store - Global)

**Localização**: `projects/shared/src/lib/ui/organisms/modal/*`  
**Responsabilidade**: Modais de confirmação

#### 5️⃣ ModalRightStore (UI Store - Global)

**Localização**: `projects/shared/src/lib/ui/organisms/modal-right/*`  
**Responsabilidade**: Modal lateral (drawer) para formulários

---

## 🔄 Fluxo de Dados na Aplicação

### Arquitetura de Fluxo

```
┌─────────────────────────────────────────────────────────────┐
│                    SMART COMPONENT (Page)                    │
│                  ProductsManagerComponent                    │
│                                                               │
│  • Injeta Stores (ProductsStore, SkeletonStore, etc.)        │
│  • Coordena ações do usuário                                 │
│  • Gerencia abertura de modais                              │
│  • Não conhece detalhes de implementação dos filhos         │
└───────────────────┬──────────────────┬──────────────────────┘
                    │                  │
         ┌──────────▼──────┐    ┌─────▼──────┐
         │  DUMB COMPONENT │    │    DUMB    │
         │  ProductList    │    │  FormMgr   │
         │                 │    │            │
         │  @Input()       │    │ @Input()   │
         │  @Output()      │    │ @Output()  │
         └─────────────────┘    └────────────┘
                    │                  │
         ┌──────────▼──────────────────▼──────────────┐
         │          SIGNAL STORE (Estado)             │
         │            ProductsStore                   │
         │                                            │
         │  • State: allProducts, products, etc.      │
         │  • Computed: filteredProducts, dataLoaded  │
         │  • Methods: loadProducts, saveProduct      │
         │  • Hooks: onInit                           │
         └────────────┬───────────────────────────────┘
                      │
         ┌────────────▼────────────┐
         │   SERVICE (HTTP)        │
         │   ProductService        │
         │                         │
         │  • getAllProducts()     │
         │  • createProduct()      │
         │  • updateProduct()      │
         │  • deleteProduct()      │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │     BASE SERVICE        │
         │   (Abstração HTTP)      │
         │                         │
         │  • get(), post()        │
         │  • put(), delete()      │
         └────────────┬────────────┘
                      │
         ┌────────────▼────────────┐
         │   ERROR INTERCEPTOR     │
         │  (Tratamento Global)    │
         └─────────────────────────┘
                      │
         ┌────────────▼────────────┐
         │       FAKE STORE API    │
         │  fakestoreapi.com       │
         └─────────────────────────┘
```

### Exemplo de Fluxo: Carregar Produtos

```
1. USER ACTION
   └─> Usuário acessa a página de produtos

2. COMPONENT INITIALIZATION
   └─> ProductsManagerComponent é criado
       └─> Injeta ProductsStore

3. STORE INITIALIZATION (onInit Hook)
   └─> ProductsStore.onInit() é executado automaticamente
       └─> Chama store.loadProducts()

4. LOADING STATE
   └─> rxMethod inicia
       └─> skeletonStore.show() é chamado
           └─> SkeletonStore.loading = true
               └─> UI mostra skeletons automaticamente

5. HTTP REQUEST
   └─> productService.getAllProducts() é executado
       └─> BaseService.get() faz a requisição
           └─> ErrorInterceptor monitora a requisição

6. SUCCESS RESPONSE
   └─> Produtos retornam da API
       └─> patchState(store, { allProducts, products })
           └─> Computed signals (filteredProducts) recalculam
               └─> skeletonStore.hide()
                   └─> UI atualiza automaticamente

7. UI UPDATE
   └─> Componentes ouvem mudanças via signals
       └─> ProductListComponent recebe products()
           └─> Lista é renderizada com @for
```

### Exemplo de Fluxo: Busca em Tempo Real

```
1. USER TYPES
   └─> Usuário digita no input de busca

2. REACTIVE FORM
   └─> searchControl.valueChanges emite valor
       └─> toSignal() converte para signal
           └─> effect() detecta mudança

3. DEBOUNCE
   └─> productsStore.setSearchTerm(value)
       └─> rxMethod com debounceTime(300ms)
           └─> Aguarda usuário parar de digitar

4. LOADING STATE
   └─> skeletonStore.show()
       └─> UI mostra skeletons

5. FILTER COMPUTATION
   └─> patchState(store, { searchTerm })
       └─> Computed signal filteredProducts() recalcula
           └─> Filtra produtos localmente
               └─> patchState(store, { products: filtered })

6. UI UPDATE
   └─> skeletonStore.hide()
       └─> ProductListComponent atualiza lista
           └─> Renderiza apenas produtos filtrados
```

---

## 💀 Sistema de Skeleton Loading

### Arquitetura do Sistema de Skeleton

O sistema de Skeleton Loading é composto por três camadas que trabalham juntas:

```
┌──────────────────────────────────────────────┐
│         1. SKELETON STORE (Estado)           │
│         SkeletonStore (Signal Store)         │
│                                              │
│  • loading: boolean                          │
│  • show(), hide(), toggle()                  │
└──────────────────┬───────────────────────────┘
                   │
      ┌────────────┴────────────┐
      ▼                         ▼
┌─────────────────┐    ┌───────────────────┐
│  2. DIRETIVA    │    │  3. COMPONENTES   │
│  [appSkeleton]  │    │     SKELETON      │
│                 │    │                   │
│  • width        │    │  ProductCard      │
│  • height       │    │    Skeleton       │
│  • shape        │    │                   │
└─────────────────┘    └───────────────────┘
```

### 1️⃣ SkeletonStore - Gerenciamento de Estado

**Localização**: `projects/shared/src/lib/utils/directives/skeleton/store/skeleton.store.ts`

```typescript
export const SkeletonStore = signalStore(
  { providedIn: 'root' },

  withState<SkeletonState>({
    loading: false
  }),

  withMethods(store => ({
    // Ativa estado de loading
    show(): void {
      patchState(store, { loading: true });
    },

    // Desativa estado de loading
    hide(): void {
      patchState(store, { loading: false });
    },

    // Alterna estado
    toggle(): void {
      patchState(store, { loading: !store.loading() });
    },

    // Define estado diretamente
    setLoading(isLoading: boolean): void {
      patchState(store, { loading: isLoading });
    }
  }))
);
```

**Como usar no código**:

```typescript
// No ProductsStore
loadProducts: rxMethod<void>(
  pipe(
    tap(() => skeletonStore.show()), // ← Ativa skeleton
    switchMap(() =>
      productService.getAllProducts().pipe(
        tap(products => {
          skeletonStore.hide(); // ← Desativa skeleton
          patchState(store, { products });
        })
      )
    )
  )
);
```

### 2️⃣ SkeletonDirective - Aplicação Visual

**Localização**: `projects/shared/src/lib/utils/directives/skeleton/skeleton.directive.ts`

A diretiva `[appSkeleton]` adiciona automaticamente efeitos visuais de loading aos elementos.

```typescript
@Directive({
  selector: '[appSkeleton]',
  host: {
    '[class.skeleton-active]': 'isSkeletonActive()',
    '[class.skeleton-circle]': 'isSkeletonActive() && shape() === "circle"',
    '[class.skeleton-rect]': 'isSkeletonActive() && shape() === "rect"'
  }
})
export class SkeletonDirective {
  private readonly skeletonStore = inject(SkeletonStore);

  width = input<string>(); // Largura customizada
  height = input<string>(); // Altura customizada
  shape = input<'rect' | 'circle'>('rect'); // Formato

  private readonly isSkeletonActive = computed(() => this.skeletonStore.loading());
}
```

**Como usar no template**:

```html
<!-- Skeleton simples (usa dimensões do elemento) -->
<div appSkeleton>Conteúdo</div>

<!-- Skeleton com dimensões customizadas -->
<div appSkeleton [width]="'100%'" [height]="'200px'"></div>

<!-- Skeleton circular (para avatares) -->
<div appSkeleton [width]="'40px'" [height]="'40px'" [shape]="'circle'"></div>
```

**Estilos SCSS**:

```scss
// Animação de loading
.skeleton-active {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
  border-radius: 4px;
  pointer-events: none;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-circle {
  border-radius: 50%;
}
```

### 3️⃣ Componentes Skeleton Especializados

Para layouts mais complexos, criamos componentes skeleton dedicados.

**Exemplo**: ProductCardSkeletonComponent

**Localização**: `projects/shared/src/lib/ui/organisms/product-card/skeleton/product-card-skeleton.component.ts`

```typescript
@Component({
  selector: 'app-product-card-skeleton',
  template: `
    <div class="product-card">
      <!-- Skeleton da imagem -->
      <section class="product-image">
        <div appSkeleton [width]="sizes.imageFull" [height]="sizes.imageFull"></div>
      </section>

      <app-card>
        <section class="product-details">
          <!-- Skeleton da categoria -->
          <span
            class="product-category"
            appSkeleton
            [width]="sizes.categoryWidth"
            [height]="sizes.categoryHeight"></span>

          <!-- Skeleton do título -->
          <h2 class="product-title" appSkeleton [width]="sizes.titleWidth" [height]="sizes.titleHeight"></h2>

          <!-- Skeleton do preço -->
          <p class="product-price" appSkeleton [width]="sizes.priceWidth" [height]="sizes.priceHeight"></p>
        </section>

        <!-- Skeletons dos botões -->
        <section class="product-actions">
          <button disabled appSkeleton [width]="sizes.buttonSize" [height]="sizes.buttonSize"></button>
          <button disabled appSkeleton [width]="sizes.buttonSize" [height]="sizes.buttonSize"></button>
        </section>
      </app-card>
    </div>
  `
})
export class ProductCardSkeletonComponent {
  protected readonly constants = PRODUCT_CARD_SKELETON_CONSTANTS;
}
```

### Uso Completo na Aplicação

**ProductListComponent** (Componente Burro)

**Localização**: `src/app/features/products/components/product-list/product-list.component.ts`

```typescript
@Component({
  selector: 'app-product-list',
  template: `
    @if (loading()) {
      <!-- Mostra 9 skeletons durante loading -->
      @for (item of skeletonItems; track $index) {
        <app-product-card-skeleton />
      }
    } @else if (products().length === 0) {
      <!-- Empty state quando não há produtos -->
      <app-empty-list [message]="'Nenhum produto encontrado'" (retryEvent)="retryEvent.emit()" />
    } @else {
      <!-- Lista real de produtos -->
      @for (product of products(); track product.id) {
        <app-product-card
          [product]="product"
          (deleteEvent)="deleteEvent.emit(product.id)"
          (editEvent)="editEvent.emit(product.id)" />
      }
    }
  `
})
export class ProductListComponent {
  loading = input.required<boolean>();
  products = input.required<Product[]>();

  deleteEvent = output<number>();
  editEvent = output<number>();
  retryEvent = output<void>();

  protected readonly skeletonItems = Array(9).fill(null);
}
```

**ProductsManagerComponent** (Componente Inteligente)

```typescript
@Component({
  selector: 'app-products-manager',
  template: `
    <app-product-list
      [products]="products()"
      [loading]="loading()"
      (deleteEvent)="handleDeleteProductById($event)"
      (editEvent)="handleEditProductById($event)" />
  `
})
export class ProductsManagerComponent {
  protected readonly productsStore = inject(ProductsStore);
  protected readonly skeletonStore = inject(SkeletonStore);

  // Computed signals derivados dos stores
  protected readonly loading = computed(() => this.skeletonStore.loading());

  protected readonly products = computed(() => this.productsStore.products());
}
```

### Benefícios do Sistema

✅ **UX Superior**: Usuário vê a estrutura antes do conteúdo  
✅ **Percepção de Performance**: Loading parece instantâneo  
✅ **Consistente**: Padrão único em toda aplicação  
✅ **Declarativo**: Controle via Signal Store  
✅ **Reutilizável**: Diretiva aplicável em qualquer elemento  
✅ **Type-Safe**: Tipagem forte em todo o fluxo

---

## 🧩 Estrutura de Componentes

### Hierarquia de Componentes

```
src/app/features/products/
├── pages/                          # 🧠 SMART COMPONENTS
│   └── manager/
│       ├── manager.component.ts    # Componente inteligente principal
│       ├── manager.component.html
│       └── manager.component.scss
│
├── components/                     # 🎨 DUMB COMPONENTS
│   ├── product-list/              # Lista de produtos
│   │   ├── product-list.component.ts
│   │   ├── product-list.component.html
│   │   └── product-list.component.scss
│   │
│   └── form-manager/              # Formulário de produto
│       ├── form-manager.component.ts
│       ├── form-manager.component.html
│       └── form-manager.component.scss
│
├── models/                        # 📦 INTERFACES
│   └── product.model.ts
│
├── services/                      # ⚙️ HTTP SERVICES
│   └── products.service.ts
│
└── store/                         # ⭐ SIGNAL STORE
    └── products.store.ts
```

### Smart Component: ProductsManagerComponent

**Localização**: `src/app/features/products/pages/manager/manager.component.ts`

**Responsabilidades**:

- ✅ Injeta e coordena Signal Stores
- ✅ Gerencia estado da página via computed signals
- ✅ Orquestra ações do usuário
- ✅ Controla abertura/fechamento de modais
- ✅ Gerencia formulário de busca
- ✅ Não renderiza elementos complexos (delega para componentes burros)

```typescript
@Component({
  selector: 'app-products-manager',
  imports: [
    ProductListComponent, // Componente burro
    FormManagerComponent, // Componente burro
    ModalRightComponent,
    ButtonComponent,
    InputSearchComponent,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsManagerComponent {
  // Injeção de Stores
  private readonly modalStore = inject(ModalStore);
  protected readonly modalRightStore = inject(ModalRightStore);
  protected readonly productsStore = inject(ProductsStore);
  protected readonly skeletonStore = inject(SkeletonStore);

  // Computed signals (derivados dos stores)
  protected readonly loading = computed(() => this.skeletonStore.loading());

  protected readonly products = computed(() => this.productsStore.products());

  protected readonly productToEdit = computed(() => this.productsStore.productToEdit());

  protected readonly categories = computed(() => this.productsStore.categories());

  // Controle de busca
  protected searchControl = new FormControl('');

  private readonly searchValue = toSignal(this.searchControl.valueChanges.pipe(takeUntilDestroyed()), {
    initialValue: ''
  });

  constructor() {
    // Effect: Sincroniza busca com store
    effect(() => {
      this.productsStore.setSearchTerm(this.searchValue() ?? '');
    });
  }

  // Ações coordenadas
  handleNewProduct(): void {
    this.productsStore.setProductToEdit(null);
    this.modalRightStore.open({ title: 'Adicionar produto' });
  }

  handleEditProductById(productId: number): void {
    const product = this.productsStore.findProductById(productId);
    if (product) {
      this.modalRightStore.open({
        title: `Editar produto #${product.id}`
      });
      this.productsStore.setProductToEdit(product);
    }
  }

  onSaveProduct(product: Product): void {
    this.productsStore.saveProduct(product);
    this.modalRightStore.close();
  }

  handleDeleteProductById(productId: number): void {
    const product = this.productsStore.findProductById(productId);
    if (product) {
      this.modalStore.open({
        title: 'Atenção',
        content: `Deseja excluir "${product.title}"?`,
        buttons: [
          { label: 'Cancelar', action: 'cancel' },
          { label: 'Deletar', action: 'confirm' }
        ]
      });

      this.modalStore.onAfterClosed(result => {
        if (result === 'confirm') {
          this.productsStore.deleteProduct(productId);
        }
      });
    }
  }

  refreshProducts(): void {
    this.productsStore.loadProducts();
  }
}
```

### Dumb Component: ProductListComponent

**Localização**: `src/app/features/products/components/product-list/product-list.component.ts`

**Responsabilidades**:

- ✅ Apenas apresentação visual
- ✅ Recebe dados via `@Input()` (signals)
- ✅ Emite eventos via `@Output()` (signals)
- ✅ Não conhece a API ou stores
- ✅ Não tem lógica de negócio

```typescript
@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent, ProductCardSkeletonComponent, EmptyListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  // Inputs (dados recebidos do pai)
  loading = input.required<boolean>();
  products = input.required<Product[]>();

  // Outputs (eventos emitidos para o pai)
  deleteEvent = output<number>();
  editEvent = output<number>();
  retryEvent = output<void>();

  protected readonly skeletonItems = Array(9).fill(null);

  onDelete(productId: number) {
    this.deleteEvent.emit(productId); // ← Apenas emite, não sabe o que acontece
  }

  onEdit(productId: number) {
    this.editEvent.emit(productId); // ← Apenas emite
  }
}
```

### Dumb Component: FormManagerComponent

**Localização**: `src/app/features/products/components/form-manager/form-manager.component.ts`

**Responsabilidades**:

- ✅ Gerencia formulário reativo
- ✅ Validação de campos
- ✅ Emite evento de save com dados do formulário
- ✅ Não chama APIs diretamente

```typescript
@Component({
  selector: 'app-form-manager',
  imports: [ReactiveFormsModule, InputComponent, TextAreaComponent, SelectComponent, ButtonComponent, ImageComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormManagerComponent {
  protected readonly fb = inject(FormBuilder);

  // Inputs
  data = input<Product | null>(null);
  categories = input.required<Category[]>();

  // Outputs
  save = output<Product>();
  cancelForm = output<void>();

  // Formulário reativo com validações
  productForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(0.01)]],
    category: ['', Validators.required],
    image: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [UrlImageValidator()], // ← Validação assíncrona
      updateOn: 'blur'
    }),
    description: ['', [Validators.required, Validators.minLength(10)]]
  });

  // Computed signals
  categoryOptions = computed<SelectOption[]>(() => {
    const categories = this.categories();
    return categories.map(category => ({
      value: category,
      label: category.charAt(0).toUpperCase() + category.slice(1)
    }));
  });

  constructor() {
    // Effect: Preenche formulário quando data muda
    effect(() => {
      const data = this.data();
      if (data) {
        this.productForm.patchValue(data);
      } else {
        this.productForm.reset();
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.getRawValue();
    const productToSave: Product = {
      ...(this.data() || ({} as Product)),
      ...formValue
    } as Product;

    this.save.emit(productToSave); // ← Apenas emite dados
  }

  onCancel(): void {
    this.cancelForm.emit();
  }
}
```

### Comunicação entre Componentes

```
┌─────────────────────────────────────────────┐
│         ProductsManagerComponent            │
│              (SMART)                        │
│                                             │
│  products = computed(() =>                  │
│    this.productsStore.products()            │
│  )                                          │
│                                             │
│  handleEdit(id) {                           │
│    const p = store.findProductById(id)      │
│    store.setProductToEdit(p)                │
│    modalStore.open()                        │
│  }                                          │
└──────────┬────────────────────┬─────────────┘
           │                    │
      [products]()          [data]()
      (editEvent)           (save)
           │                    │
    ┌──────▼──────┐      ┌──────▼──────┐
    │ ProductList │      │  FormMgr    │
    │   (DUMB)    │      │   (DUMB)    │
    │             │      │             │
    │ @Input()    │      │ @Input()    │
    │ products    │      │ data        │
    │             │      │             │
    │ @Output()   │      │ @Output()   │
    │ editEvent   │      │ save        │
    └─────────────┘      └─────────────┘
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Criar um Novo Produto

```typescript
// 1. Usuário clica no botão "Adicionar Produto"
handleNewProduct(): void {
  // Define productToEdit como null (modo criação)
  this.productsStore.setProductToEdit(null);

  // Abre modal lateral
  this.modalRightStore.open({ title: 'Adicionar produto' });
}

// 2. Usuário preenche o formulário no FormManagerComponent

// 3. Usuário clica em "Salvar"
onSubmit(): void {
  const product = this.productForm.getRawValue();
  this.save.emit(product);  // ← Emite para o pai
}

// 4. ProductsManagerComponent recebe o evento
onSaveProduct(product: Product): void {
  this.productsStore.saveProduct(product);  // ← Chama método do store
  this.modalRightStore.close();
}

// 5. ProductsStore executa a ação
saveProduct: rxMethod<Product>(
  pipe(
    tap(() => skeletonStore.show()),
    switchMap(product =>
      productService.createProduct(product).pipe(
        switchMap(() => productService.getAllProducts()),
        tap(products => {
          skeletonStore.hide();
          patchState(store, { allProducts: products, products });
          toastStore.show({
            type: PRODUCTS_CONSTANTS.TOAST_TYPES.SUCCESS,
            message: PRODUCTS_CONSTANTS.TOAST_MESSAGES.CREATE_SUCCESS
          });
        })
      )
    )
  )
)
```

### Exemplo 2: Busca em Tempo Real

```typescript
// 1. Usuário digita no campo de busca
<app-input-search [formControl]="searchControl" />

// 2. FormControl emite mudanças
searchControl = new FormControl('');

private readonly searchValue = toSignal(
  this.searchControl.valueChanges.pipe(takeUntilDestroyed()),
  { initialValue: '' }
);

// 3. Effect detecta mudança e atualiza store
constructor() {
  effect(() => {
    this.productsStore.setSearchTerm(this.searchValue() ?? '');
  });
}

// 4. Store aplica debounce e filtra
setSearchTerm: rxMethod<string>(
  pipe(
    debounceTime(300),  // Aguarda 300ms
    tap(term => {
      if (term) skeletonStore.show();
      patchState(store, { searchTerm: term });
    }),
    switchMap(term =>
      of(null).pipe(
        delay(term ? 300 : 0),  // Simula API
        tap(() => {
          const filtered = store.filteredProducts();
          patchState(store, { products: filtered });
          if (term) skeletonStore.hide();
        })
      )
    )
  )
)

// 5. Computed signal recalcula automaticamente
filteredProducts: computed(() => {
  const source = store.allProducts();
  const term = store.searchTerm().toLowerCase();

  if (!source || !term) return source ?? [];

  return source.filter(p =>
    p.title.toLowerCase().includes(term)
  );
})

// 6. UI atualiza automaticamente via signal
products = computed(() => this.productsStore.products());
```

### Exemplo 3: Validação de URL com Preview

```typescript
// 1. Definição do campo com validador assíncrono
productForm = this.fb.group({
  image: new FormControl('', {
    validators: [Validators.required],
    asyncValidators: [UrlImageValidator()],  // ← Validador custom
    updateOn: 'blur'  // Valida ao sair do campo
  })
});

// 2. Template mostra preview quando válido
@if (productForm.controls.image.valid && productForm.controls.image.value) {
  <app-image
    [src]="productForm.controls.image.value"
    [alt]="'Preview'"
    [width]="width"
    [height]="height" />
}

// 3. Validador (UrlImageValidator)
export function UrlImageValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const value = control.value?.trim();

    if (!value) return of(null);

    return new Observable(observer => {
      const img = new Image();

      img.onload = () => {
        observer.next(null);  // ✅ Válido
        observer.complete();
      };

      img.onerror = () => {
        observer.next({ invalidUrl: true });  // ❌ Inválido
        observer.complete();
      };

      img.src = value;  // Tenta carregar imagem
    });
  };
}
```

### Exemplo 4: Deletar Produto com Confirmação

```typescript
// 1. Usuário clica em deletar no ProductListComponent
<app-product-card
  (deleteEvent)="deleteEvent.emit(product.id)" />

// 2. ProductsManagerComponent intercepta evento
handleDeleteProductById(productId: number): void {
  const product = this.productsStore.findProductById(productId);

  if (product) {
    // Abre modal de confirmação
    this.modalStore.open({
      title: 'Atenção',
      content: `Deseja excluir "${product.title}"?`,
      buttons: [
        { label: 'Cancelar', action: 'cancel' },
        { label: 'Deletar', action: 'confirm' }
      ]
    });

    // Aguarda resposta do modal
    this.modalStore.onAfterClosed(result => {
      if (result === 'confirm') {
        this.productsStore.deleteProduct(productId);
      }
    });
  }
}

// 3. Store executa deleção
deleteProduct: rxMethod<number>(
  pipe(
    switchMap(productId =>
      productService.deleteProduct(productId).pipe(
        tap(() => {
          // Remove localmente (otimistic update)
          const currentProducts = store.products();
          patchState(store, {
            products: currentProducts.filter(p => p.id !== productId)
          });

          toastStore.show({
            type: PRODUCTS_CONSTANTS.TOAST_TYPES.SUCCESS,
            message: PRODUCTS_CONSTANTS.TOAST_MESSAGES.DELETE_SUCCESS
          });
        }),
        catchError(() => {
          toastStore.show({
            type: PRODUCTS_CONSTANTS.TOAST_TYPES.ERROR,
            message: PRODUCTS_CONSTANTS.TOAST_MESSAGES.DELETE_ERROR
          });
          return of(null);
        })
      )
    )
  )
)
```

---

## 🛠️ Serviços e Infraestrutura

### ProductService - Comunicação com API

**Localização**: `src/app/features/products/services/products.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}${environment.endpoints.products}`;
  private readonly baseService = inject(BaseService);

  getAllProducts(): Observable<Product[]> {
    return this.baseService.get<Product[]>(this.apiUrl).pipe(
      map(products =>
        products.map(p => ({
          ...p,
          image: p.image || 'assets/images/empty-image.jpg'
        }))
      )
    );
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.baseService.post<Product, Omit<Product, 'id'>>(this.apiUrl, product);
  }

  updateProduct(product: Product): Observable<Product> {
    return this.baseService.put<Product, Product>(`${this.apiUrl}/${product.id}`, product);
  }

  deleteProduct(id: number): Observable<number> {
    return this.baseService.delete<number>(`${this.apiUrl}/${id}`);
  }

  getAllCategories(): Observable<Category[]> {
    return this.baseService.get<Category[]>(this.categoriesUrl);
  }
}
```

### BaseService - Abstração HTTP

**Localização**: `src/app/core/services/base.service.ts`

```typescript
@Injectable({ providedIn: 'root' })
export class BaseService {
  private http = inject(HttpClient);

  public get<T>(path: string, options?: RequestOptions): Observable<T> {
    return this.http.get<T>(path, {
      headers: options?.headers,
      params: options?.params
    });
  }

  public post<T, P>(path: string, payload: P, options?: RequestOptions): Observable<T> {
    return this.http.post<T>(path, payload, {
      headers: options?.headers,
      params: options?.params
    });
  }

  public put<T, P>(path: string, payload: P, options?: RequestOptions): Observable<T> {
    return this.http.put<T>(path, payload, {
      headers: options?.headers,
      params: options?.params
    });
  }

  public delete<T>(path: string, options?: RequestOptions): Observable<T> {
    return this.http.delete<T>(path, {
      headers: options?.headers,
      params: options?.params
    });
  }
}
```

### ErrorInterceptor - Tratamento Global de Erros

**Localização**: `src/app/core/interceptors/error.interceptor.ts`

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocorreu um erro desconhecido!';

      if (error.error instanceof ErrorEvent) {
        // Erro do lado do cliente
        errorMessage = `Erro: ${error.error.message}`;
      } else {
        // Erro do lado do servidor
        errorMessage = `Código: ${error.status}\nMensagem: ${error.message}`;
      }

      return throwError(() => new Error(errorMessage));
    })
  );
};
```

**Registro no app.config.ts**:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([errorInterceptor]) // ← Registrado globalmente
    )
  ]
};
```

---

## 🚀 Executando o Projeto

### Pré-requisitos

```bash
Node.js >= 18.x
pnpm >= 8.x
```

### Instalação

```bash
# Instalar dependências
pnpm install
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
pnpm start

# Aplicação disponível em: http://localhost:4200
```

### Build de Produção

```bash
# Build otimizado
pnpm build

# Output: dist/store-app/
```

### Testes

```bash
# Executar testes unitários
pnpm test

# Executar em modo watch
pnpm test:watch

# Cobertura de testes
pnpm test:coverage
```

---

## 📚 Referências e Recursos

### Arquivos Importantes

| Arquivo                                                                                         | Descrição                   |
| ----------------------------------------------------------------------------------------------- | --------------------------- |
| `src/app/features/products/store/products.store.ts`                                             | Signal Store principal      |
| `src/app/features/products/pages/manager/manager.component.ts`                                  | Smart Component             |
| `src/app/features/products/components/product-list/product-list.component.ts`                   | Dumb Component (lista)      |
| `src/app/features/products/components/form-manager/form-manager.component.ts`                   | Dumb Component (formulário) |
| `projects/shared/src/lib/utils/directives/skeleton/store/skeleton.store.ts`                     | Skeleton Store              |
| `projects/shared/src/lib/utils/directives/skeleton/skeleton.directive.ts`                       | Skeleton Directive          |
| `projects/shared/src/lib/ui/organisms/product-card/skeleton/product-card-skeleton.component.ts` | Componente Skeleton         |

### Documentação Oficial

- [NgRx Signals](https://ngrx.io/guide/signals)
- [Angular Signals](https://angular.io/guide/signals)
- [Feature-Sliced Design](https://feature-sliced.design/)

---

## 🎯 Conclusão

Este projeto demonstra uma arquitetura moderna e escalável usando:

✅ **NgRx Signal Store** para gerenciamento de estado reativo  
✅ **Feature-Sliced Design** para organização por domínio  
✅ **Smart/Dumb Components** para separação de responsabilidades  
✅ **Skeleton Loading** para UX superior  
✅ **Computed Signals** para dados derivados  
✅ **rxMethod** para integração RxJS + Signals  
✅ **Validação Assíncrona** com preview em tempo real  
✅ **Interceptadores HTTP** para tratamento centralizado

A combinação dessas técnicas resulta em código **type-safe**, **testável**, **performático** e **fácil de manter**.

---

**Última atualização**: Outubro 2025  
**Versão**: 1.0.0
