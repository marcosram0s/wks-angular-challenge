# 📚 Shared Library - Design System & Biblioteca Reutilizável

> **Biblioteca Angular compartilhada que implementa um Design System completo baseado em Atomic Design, utilitários reutilizáveis e gerenciamento de estado com NgRx Signal Store**

[![Angular](https://img.shields.io/badge/Angular-19.2-red?logo=angular)](https://angular.io/)
[![NgRx Signals](https://img.shields.io/badge/State-NgRx_Signals-purple)](https://ngrx.io/guide/signals)
[![Atomic Design](https://img.shields.io/badge/Architecture-Atomic_Design-blueviolet)](https://atomicdesign.bradfrost.com/)
[![Standalone](https://img.shields.io/badge/Components-Standalone-brightgreen)](https://angular.io/)
[![Tree Shakeable](https://img.shields.io/badge/Tree-Shakeable-blue)](https://angular.io/)

---

## 📑 Índice

- [Visão Geral](#-visão-geral)
- [Arquitetura da Biblioteca](#-arquitetura-da-biblioteca)
- [UI Components (Atomic Design)](#-ui-components---atomic-design)
- [Utils (Utilitários Reutilizáveis)](#-utils---utilitários-reutilizáveis)
- [Signal Stores Globais](#-signal-stores-globais)
- [Design Tokens](#-design-tokens)
- [Como Usar](#-como-usar-a-biblioteca)
- [Executando Testes](#-executando-testes)

---

## 🎯 Visão Geral

A biblioteca `shared` é o **coração da consistência visual e funcional** do projeto. Ela não é apenas uma coleção de componentes, mas um **sistema de design completo** que fornece:

### Propósito

✅ **Componentes UI Reutilizáveis**: Baseados em Atomic Design para máxima composição  
✅ **Utilitários Comuns**: Diretivas, pipes, validators e stores compartilhados  
✅ **Gerenciamento de Estado Global**: Signal Stores para UI (Toast, Modal, Skeleton)  
✅ **Design Tokens**: Sistema centralizado de cores, espaçamentos e tipografia  
✅ **Consistência Visual**: Interface unificada em toda aplicação  
✅ **Tree-Shakeable**: Apenas o código usado é incluído no bundle final

### Por que criar uma biblioteca compartilhada?

**Antes (sem biblioteca compartilhada)**:

```
❌ Componentes duplicados em múltiplos lugares
❌ Estilos inconsistentes
❌ Lógica repetida (validadores, pipes, etc.)
❌ Difícil manutenção (mudanças em N lugares)
❌ Bundle maior (código duplicado)
```

**Depois (com shared library)**:

```
✅ Componente único reutilizado em toda aplicação
✅ Estilos centralizados (Design Tokens)
✅ Lógica única testada e documentada
✅ Manutenção simplificada (mudança em 1 lugar)
✅ Bundle otimizado (tree-shaking)
```

---

## 🏗️ Arquitetura da Biblioteca

### Estrutura de Diretórios

```
projects/shared/
├── src/
│   ├── lib/
│   │   ├── ui/                          # 🎨 COMPONENTES DE INTERFACE
│   │   │   ├── atoms/                   # Componentes indivisíveis
│   │   │   │   ├── button/             # Botões
│   │   │   │   ├── input/              # Campos de entrada
│   │   │   │   ├── input-search/       # Campo de busca
│   │   │   │   ├── image/              # Imagens otimizadas
│   │   │   │   ├── select/             # Dropdowns
│   │   │   │   └── text-area/          # Áreas de texto
│   │   │   │
│   │   │   ├── molecules/              # Composições de átomos
│   │   │   │   ├── card/               # Cards genéricos
│   │   │   │   ├── empty-list/         # Estado vazio
│   │   │   │   └── navbar/             # Barra de navegação
│   │   │   │
│   │   │   ├── organisms/              # Componentes complexos
│   │   │   │   ├── modal/              # Modal genérico
│   │   │   │   │   ├── modal.component.ts
│   │   │   │   │   ├── store/          # ModalStore (NgRx)
│   │   │   │   │   └── models/
│   │   │   │   │
│   │   │   │   ├── modal-right/        # Modal lateral (drawer)
│   │   │   │   │   ├── modal-right.component.ts
│   │   │   │   │   ├── store/          # ModalRightStore (NgRx)
│   │   │   │   │   └── models/
│   │   │   │   │
│   │   │   │   ├── toast/              # Sistema de notificações
│   │   │   │   │   ├── toast.component.ts
│   │   │   │   │   ├── store/          # ToastStore (NgRx)
│   │   │   │   │   └── models/
│   │   │   │   │
│   │   │   │   └── product-card/       # Card de produto
│   │   │   │       ├── product-card.component.ts
│   │   │   │       └── skeleton/       # ProductCardSkeletonComponent
│   │   │   │
│   │   │   ├── styles/                 # Design Tokens & Estilos globais
│   │   │   │   ├── tokens.scss         # Variáveis de design
│   │   │   │   ├── skeleton.scss       # Estilos de skeleton loading
│   │   │   │   ├── accessibility.scss  # Estilos de acessibilidade
│   │   │   │   └── index.scss          # Exportações
│   │   │   │
│   │   │   └── index.ts                # Exportações públicas UI
│   │   │
│   │   └── utils/                      # 🛠️ UTILITÁRIOS REUTILIZÁVEIS
│   │       ├── directives/             # Diretivas customizadas
│   │       │   ├── focus/              # Auto-focus
│   │       │   │   └── focus.directive.ts
│   │       │   │
│   │       │   └── skeleton/           # Sistema de skeleton loading
│   │       │       ├── skeleton.directive.ts
│   │       │       ├── store/          # SkeletonStore (NgRx)
│   │       │       │   └── skeleton.store.ts
│   │       │       └── models/
│   │       │
│   │       ├── pipes/                  # Pipes de transformação
│   │       │   └── truncate/           # Truncar textos
│   │       │       └── truncate.pipe.ts
│   │       │
│   │       ├── validators/             # Validadores de formulário
│   │       │   └── url-validator/      # Validação assíncrona de URLs
│   │       │       └── url.validator.ts
│   │       │
│   │       └── index.ts                # Exportações públicas Utils
│   │
│   └── public-api.ts                   # API pública da biblioteca
│
├── package.json                        # Metadados da biblioteca
├── ng-package.json                     # Configuração de build
└── README.md                           # Este arquivo

Path Aliases configurados:
  @shared/ui    → projects/shared/src/lib/ui
  @shared/utils → projects/shared/src/lib/utils
```

### Filosofia de Organização

A biblioteca está dividida em **duas grandes áreas** que trabalham em conjunto:

#### 1. **UI** - Componentes Visuais

- Organizada por **Atomic Design** (atoms → molecules → organisms)
- Componentes focados em **apresentação**
- Alguns organismos possuem **Signal Stores** próprios (Modal, Toast)
- **Totalmente standalone** e tree-shakeable

#### 2. **Utils** - Utilitários Reutilizáveis

- **Diretivas**: Comportamentos adicionais ao DOM
- **Pipes**: Transformações de dados no template
- **Validators**: Validações customizadas de formulários
- **Stores**: Gerenciamento de estado global (Skeleton)

### Como UI e Utils Colaboram

```
┌─────────────────────────────────────────────────┐
│              APLICAÇÃO CONSUMIDORA              │
│         (store-app ou outras apps)              │
└────────────┬────────────────────────────────────┘
             │
             │ importa componentes e utilitários
             │
    ┌────────▼────────┐         ┌────────────────┐
    │   UI Components │◄────────┤ Utils          │
    │   (atoms, etc)  │  usa    │ (directives,   │
    │                 │         │  pipes, stores)│
    └─────────────────┘         └────────────────┘
             │                          │
             │                          │
    ┌────────▼────────┐         ┌──────▼─────────┐
    │  Signal Stores  │         │ Signal Stores  │
    │  (Modal, Toast) │         │ (Skeleton)     │
    └─────────────────┘         └────────────────┘
```

**Exemplo de Colaboração**:

```typescript
// ButtonComponent (UI) usa FocusDirective (Utils)
@Component({
  selector: 'app-button',
  imports: [FocusDirective], // ← Diretiva de Utils
  template: `
    <button [appFocus]="autoFocus()">
      {{ text() }}
    </button>
  `
})
export class ButtonComponent {
  autoFocus = input<boolean>(false);
}

// ProductListComponent usa SkeletonStore (Utils)
export class ProductListComponent {
  skeletonStore = inject(SkeletonStore); // ← Store de Utils
  loading = computed(() => this.skeletonStore.loading());
}

// FormComponent usa UrlImageValidator (Utils)
export class FormComponent {
  imageControl = new FormControl('', {
    asyncValidators: [UrlImageValidator()] // ← Validator de Utils
  });
}
```

---

## 🎨 UI Components - Atomic Design

### O que é Atomic Design?

**Atomic Design** é uma metodologia criada por Brad Frost que organiza componentes em uma hierarquia inspirada na química:

```
⚛️  Átomos       → Componentes indivisíveis (button, input)
                   ↓
🧪  Moléculas    → Grupos de átomos (card, navbar)
                   ↓
🦠  Organismos   → Seções complexas (modal, toast, product-card)
```

### Por que Atomic Design?

✅ **Composição Progressiva**: Componentes pequenos formam interfaces complexas  
✅ **Reutilização Máxima**: Átomos usados em múltiplos contextos  
✅ **Manutenção Simplificada**: Mudanças em átomos propagam automaticamente  
✅ **Consistência**: UI unificada em toda aplicação  
✅ **Escalabilidade**: Fácil adicionar novos componentes  
✅ **Testabilidade**: Componentes isolados são mais fáceis de testar

### Hierarquia de Componentes

#### ⚛️ Atoms (Átomos)

**Definição**: Blocos de construção fundamentais. Não podem ser divididos sem perder função.

**Características**:

- Componentes **indivisíveis**
- Geralmente **sem estado interno**
- Focados em **apresentação pura**
- **Altamente reutilizáveis**

**Localização**: `src/lib/ui/atoms/`

**Componentes Disponíveis**:

| Componente               | Descrição                                    | Arquivo                                        |
| ------------------------ | -------------------------------------------- | ---------------------------------------------- |
| **ButtonComponent**      | Botões com variações de cor, tamanho e ícone | `atoms/button/button.component.ts`             |
| **InputComponent**       | Campos de entrada de texto                   | `atoms/input/input.component.ts`               |
| **InputSearchComponent** | Campo de busca especializado                 | `atoms/input-search/input-search.component.ts` |
| **ImageComponent**       | Imagens otimizadas (NgOptimizedImage)        | `atoms/image/image.component.ts`               |
| **SelectComponent**      | Dropdowns de seleção                         | `atoms/select/select.component.ts`             |
| **TextAreaComponent**    | Áreas de texto multilinha                    | `atoms/text-area/text-area.component.ts`       |

**Exemplo - ButtonComponent**:

**Localização**: `src/lib/ui/atoms/button/button.component.ts`

```typescript
@Component({
  selector: 'app-button',
  imports: [FocusDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  // Inputs (Signals)
  text = input<string>();
  icon = input<string>();
  size = input<'small' | 'default' | 'large'>('default');
  color = input<'primary' | 'secondary' | 'danger'>('primary');
  disabled = input<boolean>(false);
  autoFocus = input<boolean>(false);
  ariaLabel = input<string>();

  // Output (Signal)
  clickEvent = output<void>();

  onClick() {
    if (!this.disabled()) {
      this.clickEvent.emit();
    }
  }
}
```

**Uso**:

```typescript
<app-button
  [text]="'Salvar'"
  [color]="'primary'"
  [size]="'default'"
  [icon]="'ri-save-line'"
  [disabled]="!isValid()"
  [autoFocus]="true"
  (clickEvent)="onSave()"
/>
```

---

#### 🧪 Molecules (Moléculas)

**Definição**: Grupos de átomos trabalhando juntos como uma unidade.

**Características**:

- **Composição de 2+ átomos**
- Representam um **conceito único**
- Podem ter **lógica simples**
- Ainda são **reutilizáveis**

**Localização**: `src/lib/ui/molecules/`

**Componentes Disponíveis**:

| Componente             | Descrição                   | Arquivo                                        |
| ---------------------- | --------------------------- | ---------------------------------------------- |
| **CardComponent**      | Card genérico para conteúdo | `molecules/card/card.component.ts`             |
| **EmptyListComponent** | Estado vazio para listas    | `molecules/empty-list/empty-list.component.ts` |
| **NavbarComponent**    | Barra de navegação          | `molecules/navbar/navbar.component.ts`         |

**Exemplo - CardComponent**:

```typescript
<app-card>
  <h3>Título do Card</h3>
  <p>Conteúdo do card...</p>
  <app-button [text]="'Ação'" (clickEvent)="onAction()" />
</app-card>
```

**Exemplo - EmptyListComponent**:

```typescript
<app-empty-list
  [message]="'Nenhum produto encontrado'"
  [icon]="'ri-inbox-line'"
  (retryEvent)="onRetry()"
/>
```

---

#### 🦠 Organisms (Organismos)

**Definição**: Componentes complexos que formam seções distintas da interface.

**Características**:

- **Altamente específicos** para um contexto
- Têm **lógica de negócio** embutida
- Geralmente **gerenciam estado** (via Signal Store)
- **Menos reutilizáveis** (mas ainda podem ser)

**Localização**: `src/lib/ui/organisms/`

**Componentes Disponíveis**:

| Componente                       | Descrição                     | Store?             | Arquivo                                                              |
| -------------------------------- | ----------------------------- | ------------------ | -------------------------------------------------------------------- |
| **ModalComponent**               | Modal genérico de confirmação | ✅ ModalStore      | `organisms/modal/modal.component.ts`                                 |
| **ModalRightComponent**          | Modal lateral (drawer)        | ✅ ModalRightStore | `organisms/modal-right/modal-right.component.ts`                     |
| **ToastComponent**               | Sistema de notificações       | ✅ ToastStore      | `organisms/toast/toast.component.ts`                                 |
| **ProductCardComponent**         | Card de produto completo      | ❌                 | `organisms/product-card/product-card.component.ts`                   |
| **ProductCardSkeletonComponent** | Skeleton do ProductCard       | ❌                 | `organisms/product-card/skeleton/product-card-skeleton.component.ts` |

**Exemplo - ModalComponent com ModalStore**:

**Localização Store**: `src/lib/ui/organisms/modal/store/modal.store.ts`

```typescript
// ModalStore (NgRx Signal Store)
export const ModalStore = signalStore(
  { providedIn: 'root' },

  withState<ModalState>({
    isOpen: false,
    data: undefined
  }),

  withMethods(store => ({
    open(data: ModalModel): void {
      renderer.setStyle(document.body, 'overflow', 'hidden');
      patchState(store, { isOpen: true, data });
    },

    close(action?: string): void {
      renderer.removeStyle(document.body, 'overflow');
      patchState(store, { isOpen: false, data: undefined });

      if (onClosedCallback) {
        onClosedCallback(action);
      }
    },

    onAfterClosed(callback: ModalCloseCallback): void {
      onClosedCallback = callback;
    }
  }))
);
```

**Uso do Modal**:

```typescript
export class MyComponent {
  private modalStore = inject(ModalStore);

  showConfirmation() {
    // Abre modal
    this.modalStore.open({
      title: 'Confirmar Exclusão',
      content: 'Deseja realmente excluir este item?',
      buttons: [
        { label: 'Cancelar', action: 'cancel' },
        { label: 'Excluir', action: 'confirm' }
      ]
    });

    // Aguarda resposta
    this.modalStore.onAfterClosed(result => {
      if (result === 'confirm') {
        this.deleteItem();
      }
    });
  }
}
```

**Exemplo - ToastComponent com ToastStore**:

**Localização Store**: `src/lib/ui/organisms/toast/store/toast.store.ts`

```typescript
// ToastStore (NgRx Signal Store)
export const ToastStore = signalStore(
  { providedIn: 'root' },

  withState<ToastState>({ toasts: [] }),

  withMethods(store => ({
    show(toast: Omit<Toast, 'id'>): void {
      const id = this.generateId();
      const newToast: Toast = {
        ...toast,
        id,
        icon: this.getIcon(toast.type)
      };

      patchState(store, { toasts: [...store.toasts(), newToast] });

      // Agenda remoção automática
      const duration = toast.duration ?? 3000;
      this.scheduleRemoval({ id, duration });
    },

    scheduleRemoval: rxMethod<{ id: string; duration: number }>(
      pipe(
        switchMap(({ id, duration }) =>
          timer(duration).pipe(
            tap(() => {
              patchState(store, {
                toasts: store.toasts().filter(t => t.id !== id)
              });
            })
          )
        )
      )
    ),

    remove(id: string): void {
      patchState(store, {
        toasts: store.toasts().filter(t => t.id !== id)
      });
    },

    clearAll(): void {
      patchState(store, { toasts: [] });
    }
  }))
);
```

**Uso do Toast**:

```typescript
export class MyComponent {
  private toastStore = inject(ToastStore);

  onSave() {
    this.save().subscribe({
      next: () => {
        this.toastStore.show({
          type: 'success',
          message: 'Salvo com sucesso!',
          duration: 3000
        });
      },
      error: () => {
        this.toastStore.show({
          type: 'error',
          message: 'Erro ao salvar',
          duration: 5000
        });
      }
    });
  }
}
```

**Exemplo - ModalRightComponent com ModalRightStore**:

**Localização Store**: `src/lib/ui/organisms/modal-right/store/modal-right.store.ts`

```typescript
// ModalRightStore (NgRx Signal Store)
export const ModalRightStore = signalStore(
  { providedIn: 'root' },

  withState<ModalRightState>({
    isOpen: false,
    isClosing: false,
    data: { title: '' }
  }),

  withMethods(store => ({
    open(data: ModalRightModel): void {
      renderer.setStyle(document.body, 'overflow', 'hidden');
      patchState(store, { isOpen: true, isClosing: false, data });
    },

    startClosing: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { isClosing: true })),
        delay(300), // Duração da animação
        tap(() => {
          renderer.removeStyle(document.body, 'overflow');
          patchState(store, { isOpen: false, isClosing: false });
        })
      )
    ),

    close(): void {
      if (store.isOpen()) {
        this.startClosing();
      }
    }
  }))
);
```

**Uso do Modal Lateral**:

```typescript
export class ProductsManagerComponent {
  private modalRightStore = inject(ModalRightStore);

  openProductForm() {
    this.modalRightStore.open({ title: 'Adicionar Produto' });
  }

  closeForm() {
    this.modalRightStore.close();
  }
}
```

---

## 🛠️ Utils - Utilitários Reutilizáveis

### Visão Geral

A pasta `utils/` contém **lógica reutilizável** que não é componente visual. São ferramentas que componentes usam para adicionar comportamentos, transformar dados e validar inputs.

### Estrutura de Utils

```
utils/
├── directives/           # Comportamentos adicionais ao DOM
│   ├── focus/           # Auto-focus
│   └── skeleton/        # Skeleton loading + SkeletonStore
│
├── pipes/               # Transformações de dados
│   └── truncate/        # Truncar textos
│
└── validators/          # Validações customizadas
    └── url-validator/   # Validação assíncrona de URLs
```

---

### 🎯 Diretivas (Directives)

#### 1. **FocusDirective** (`[appFocus]`)

**Propósito**: Coloca foco automaticamente em elemento ao renderizar.

**Localização**: `src/lib/utils/directives/focus/focus.directive.ts`

**Uso**:

```typescript
<input [appFocus]="true" placeholder="Buscar..." />

// Em modais
<app-modal-right>
  <input [appFocus]="true" formControlName="title" />
</app-modal-right>
```

**Benefícios**:

- ✅ Melhora UX (usuário não precisa clicar)
- ✅ Acessibilidade (navegação por teclado)
- ✅ Reutilizável em qualquer elemento focável

---

#### 2. **SkeletonDirective** (`[appSkeleton]`)

**Propósito**: Transforma elementos em placeholders animados durante loading.

**Localização**: `src/lib/utils/directives/skeleton/skeleton.directive.ts`

**Características**:

- ✅ Reativo (baseado em **SkeletonStore**)
- ✅ Inteligente (detecta tipo de elemento)
- ✅ Configurável (largura, altura, forma)
- ✅ Automático (preserva estilos originais)

**Propriedades**:

| Propriedade | Tipo                 | Padrão   | Descrição                    |
| ----------- | -------------------- | -------- | ---------------------------- |
| `width`     | `string`             | auto     | Largura (ex: '200px', '50%') |
| `height`    | `string`             | auto     | Altura (ex: '20px', '100px') |
| `shape`     | `'rect' \| 'circle'` | `'rect'` | Forma do skeleton            |

**Uso Básico**:

```typescript
// Skeleton controlado pelo SkeletonStore
<h3 [appSkeleton]="true">{{ title() }}</h3>

// Com dimensões customizadas
<div [appSkeleton]="true"
     [width]="'200px'"
     [height]="'100px'">
  {{ description }}
</div>

// Circular (avatares)
<img [appSkeleton]="true"
     [width]="'64px'"
     [height]="'64px'"
     [shape]="'circle'"
     [src]="avatar" />
```

**Integração com SkeletonStore**:

```typescript
export class ProductListComponent {
  skeletonStore = inject(SkeletonStore);
  loading = computed(() => this.skeletonStore.loading());

  loadProducts() {
    this.skeletonStore.show(); // ✅ Ativa skeletons

    this.api.getProducts().subscribe(data => {
      this.products.set(data);
      this.skeletonStore.hide(); // ✅ Remove skeletons
    });
  }
}
```

**Template**:

```html
@if (loading()) {
<!-- Skeletons durante loading -->
@for (item of Array(9); track $index) {
<app-product-card-skeleton />
} } @else {
<!-- Produtos reais -->
@for (product of products(); track product.id) {
<app-product-card [product]="product" />
} }
```

---

### 🔄 Pipes

#### **TruncatePipe** (`| truncate`)

**Propósito**: Encurta textos longos adicionando reticências.

**Localização**: `src/lib/utils/pipes/truncate/truncate.pipe.ts`

**Assinatura**:

```typescript
transform(
  value: string | null | undefined,
  limit: number = 50,
  trail: string = '...'
): string
```

**Uso**:

```typescript
// Padrão (50 caracteres)
{{ longText | truncate }}

// Limite customizado
{{ longText | truncate:30 }}

// Sufixo customizado
{{ longText | truncate:40:'…' }}

// Exemplo real
<p>{{ product.description | truncate:100 }}</p>
// "Este é um texto muito longo que será truncado automaticamente..."
```

**Benefícios**:

- ✅ Mantém layouts limpos
- ✅ Performance (transformação no template)
- ✅ Reutilizável
- ✅ Configurável

---

### ✅ Validators

#### **UrlImageValidator** (`UrlImageValidator()`)

**Propósito**: Validador assíncrono que verifica se URL é imagem válida e acessível.

**Localização**: `src/lib/utils/validators/url-validator/url.validator.ts`

**Características**:

- ✅ **Assíncrono**: Carrega imagem de verdade
- ✅ **Inteligente**: Valida protocolo e extensão
- ✅ **Timeout**: 10 segundos de limite
- ✅ **Feedback**: Erro específico (`invalidUrl`)

**Como Funciona**:

1. Valida formato de URL
2. Valida protocolo (http/https)
3. Valida extensão (rejeita .pdf, .exe, etc)
4. Tenta carregar imagem real
5. Retorna `null` (válido) ou `{ invalidUrl: true }` (inválido)

**Uso**:

```typescript
// No formulário
export class FormComponent {
  form = new FormGroup({
    image: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [UrlImageValidator()], // ← Validador
      updateOn: 'blur' // Valida ao sair do campo
    })
  });
}
```

**Template com Feedback**:

```html
<input type="url" formControlName="image" />

@if (form.controls.image.pending) {
<span class="loading">⏳ Validando URL...</span>
} @if (form.controls.image.valid && form.controls.image.value) {
<img [src]="form.controls.image.value" alt="Preview" />
} @if (form.controls.image.errors?.['invalidUrl']) {
<span class="error">❌ URL inválida</span>
}
```

**Benefícios**:

- ✅ Validação real (não apenas formato)
- ✅ Feedback visual (preview)
- ✅ Previne URLs quebradas
- ✅ Reutilizável

---

## ⭐ Signal Stores Globais

### O que são Signal Stores?

**Signal Stores** são a evolução moderna do gerenciamento de estado no Angular, baseados em **NgRx Signals**. Diferente de serviços tradicionais com RxJS, eles são:

✅ **Reativos**: Baseados em Angular Signals  
✅ **Type-Safe**: Tipagem forte em todo fluxo  
✅ **Performáticos**: Change detection apenas onde necessário  
✅ **Declarativos**: API limpa e intuitiva  
✅ **Globais**: `providedIn: 'root'` (singleton)

### Stores Disponíveis na Biblioteca

| Store               | Tipo  | Localização                        | Propósito                    |
| ------------------- | ----- | ---------------------------------- | ---------------------------- |
| **SkeletonStore**   | Utils | `utils/directives/skeleton/store/` | Loading states globais       |
| **ToastStore**      | UI    | `ui/organisms/toast/store/`        | Notificações (sucesso, erro) |
| **ModalStore**      | UI    | `ui/organisms/modal/store/`        | Modais de confirmação        |
| **ModalRightStore** | UI    | `ui/organisms/modal-right/store/`  | Modal lateral (drawer)       |

---

### 💀 SkeletonStore

**Propósito**: Gerencia estado global de loading (skeletons) da aplicação.

**Tipo**: Utils Store (usado por toda aplicação)

**Localização**: `src/lib/utils/directives/skeleton/store/skeleton.store.ts`

**Implementação**:

```typescript
export const SkeletonStore = signalStore(
  { providedIn: 'root' }, // ✅ Global

  withState<SkeletonState>({
    loading: false
  }),

  withMethods(store => ({
    show(): void {
      patchState(store, { loading: true });
    },

    hide(): void {
      patchState(store, { loading: false });
    },

    toggle(): void {
      patchState(store, { loading: !store.loading() });
    },

    setLoading(isLoading: boolean): void {
      patchState(store, { loading: isLoading });
    }
  }))
);
```

**API**:

```typescript
store.loading: Signal<boolean>      // Signal reativo (read-only)
store.show(): void                  // Ativa skeletons
store.hide(): void                  // Desativa skeletons
store.toggle(): void                // Alterna estado
store.setLoading(bool): void        // Define estado
```

**Uso**:

```typescript
export class MyComponent {
  skeletonStore = inject(SkeletonStore);
  loading = computed(() => this.skeletonStore.loading());

  loadData() {
    this.skeletonStore.show();

    this.api.getData().subscribe(data => {
      this.data.set(data);
      this.skeletonStore.hide();
    });
  }
}
```

---

### 🔔 ToastStore

**Propósito**: Gerencia notificações toast (sucesso, erro, aviso, info).

**Tipo**: UI Store (componente + store)

**Localização**: `src/lib/ui/organisms/toast/store/toast.store.ts`

**API**:

```typescript
store.toasts: Signal<Toast[]>       // Lista de toasts ativos
store.show(toast): void             // Exibe toast
store.remove(id): void              // Remove toast específico
store.clearAll(): void              // Remove todos os toasts
```

**Uso**:

```typescript
export class MyComponent {
  toastStore = inject(ToastStore);

  onSuccess() {
    this.toastStore.show({
      type: 'success',
      message: 'Operação realizada com sucesso!',
      duration: 3000
    });
  }

  onError() {
    this.toastStore.show({
      type: 'error',
      message: 'Erro ao processar',
      duration: 5000
    });
  }
}
```

---

### 🪟 ModalStore

**Propósito**: Gerencia modais de confirmação.

**Tipo**: UI Store (componente + store)

**Localização**: `src/lib/ui/organisms/modal/store/modal.store.ts`

**API**:

```typescript
store.isOpen: Signal<boolean>       // Se modal está aberto
store.data: Signal<ModalModel>      // Dados do modal
store.open(data): void              // Abre modal
store.close(action?): void          // Fecha modal
store.onAfterClosed(callback): void // Callback após fechar
```

**Uso**:

```typescript
export class MyComponent {
  modalStore = inject(ModalStore);

  confirmDelete() {
    this.modalStore.open({
      title: 'Confirmar Exclusão',
      content: 'Deseja excluir este item?',
      buttons: [
        { label: 'Cancelar', action: 'cancel' },
        { label: 'Excluir', action: 'confirm' }
      ]
    });

    this.modalStore.onAfterClosed(result => {
      if (result === 'confirm') {
        this.delete();
      }
    });
  }
}
```

---

### 📱 ModalRightStore

**Propósito**: Gerencia modal lateral (drawer).

**Tipo**: UI Store (componente + store)

**Localização**: `src/lib/ui/organisms/modal-right/store/modal-right.store.ts`

**API**:

```typescript
store.isOpen: Signal<boolean>       // Se modal está aberto
store.isClosing: Signal<boolean>    // Se está em animação de fechar
store.data: Signal<ModalRightModel> // Dados do modal
store.open(data): void              // Abre modal
store.close(): void                 // Fecha com animação
```

**Uso**:

```typescript
export class ProductsComponent {
  modalRightStore = inject(ModalRightStore);

  openForm() {
    this.modalRightStore.open({
      title: 'Novo Produto'
    });
  }

  closeForm() {
    this.modalRightStore.close();
  }
}
```

---

## 🎨 Design Tokens

### O que são Design Tokens?

**Design Tokens** são as decisões de design transformadas em código. São variáveis centralizadas que definem cores, espaçamentos, tipografia e outros aspectos visuais.

**Localização**: `src/lib/ui/styles/tokens.scss`

### Categorias de Tokens

#### 🎨 Cores

```scss
// Primárias
$color-primary: #0a3d6b;
$color-primary-light: #7ba3cc;
$color-primary-dark: #062c48;

// Secundárias
$color-secondary: #c55a0d;
$color-secondary-light: #f5d0a8;
$color-secondary-dark: #803e0c;

// Neutras
$color-neutral-50: #ffffff;
$color-neutral-100: #f9fafb;
$color-neutral-900: #030712;

// Semânticas
$color-success: #16a34a;
$color-warning: #d97706;
$color-error: #dc2626;
```

#### 📏 Espaçamentos

```scss
$spacing-xxs: 0.25rem; // 4px
$spacing-xs: 0.5rem; // 8px
$spacing-sm: 0.75rem; // 12px
$spacing-md: 1rem; // 16px (base)
$spacing-lg: 1.5rem; // 24px
$spacing-xl: 2rem; // 32px
$spacing-xxl: 3rem; // 48px
```

#### 🔤 Tipografia

```scss
// Tamanhos
$font-size-xs: 0.75rem; // 12px
$font-size-sm: 0.875rem; // 14px
$font-size-base: 1rem; // 16px
$font-size-lg: 1.25rem; // 20px
$font-size-xl: 1.5rem; // 24px
$font-size-xxl: 2rem; // 32px

// Pesos
$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-bold: 700;
```

### Como Usar Tokens

```scss
@use '../../styles/tokens' as *;

.my-component {
  color: $color-primary;
  padding: $spacing-md;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
}
```

### Benefícios

✅ **Consistência**: UI unificada  
✅ **Manutenção**: Mudanças em um lugar  
✅ **Theming**: Fácil implementar temas  
✅ **Documentação**: Auto-documentado  
✅ **Comunicação**: Designers e devs falam a mesma língua

---

## 📦 Como Usar a Biblioteca

### Path Aliases Configurados

```json
{
  "paths": {
    "@shared/ui": ["./projects/shared/src/lib/ui/index.ts"],
    "@shared/utils": ["./projects/shared/src/lib/utils/index.ts"]
  }
}
```

### Importação e Uso

#### Importar Componentes UI

```typescript
import { ButtonComponent, InputComponent, CardComponent, ToastStore, ModalStore } from '@shared/ui';

@Component({
  selector: 'app-my-feature',
  imports: [ButtonComponent, InputComponent, CardComponent],
  template: `
    <app-card>
      <app-input [label]="'Nome'" />
      <app-button [text]="'Salvar'" (clickEvent)="onSave()" />
    </app-card>
  `
})
export class MyFeatureComponent {
  toastStore = inject(ToastStore);

  onSave() {
    this.toastStore.show({
      type: 'success',
      message: 'Salvo com sucesso!'
    });
  }
}
```

#### Importar Utils

```typescript
import { FocusDirective, SkeletonDirective, TruncatePipe, SkeletonStore, UrlImageValidator } from '@shared/utils';

@Component({
  selector: 'app-example',
  imports: [FocusDirective, SkeletonDirective, TruncatePipe],
  template: `
    <input [appFocus]="true" />
    <h3 [appSkeleton]="true">{{ title }}</h3>
    <p>{{ description | truncate: 50 }}</p>
  `
})
export class ExampleComponent {
  skeletonStore = inject(SkeletonStore);

  form = new FormGroup({
    image: new FormControl('', {
      asyncValidators: [UrlImageValidator()]
    })
  });
}
```

### Exemplo Completo

```typescript
import { ButtonComponent, ToastStore, ModalStore } from '@shared/ui';
import { SkeletonStore, UrlImageValidator } from '@shared/utils';

@Component({
  selector: 'app-product-form',
  imports: [ButtonComponent, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="title" />
      <input formControlName="image" type="url" />

      <app-button [text]="'Salvar'" [disabled]="form.invalid" (clickEvent)="onSubmit()" />
    </form>
  `
})
export class ProductFormComponent {
  // Injeção de Stores
  skeletonStore = inject(SkeletonStore);
  toastStore = inject(ToastStore);
  modalStore = inject(ModalStore);

  // Formulário com validador assíncrono
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    image: new FormControl('', {
      validators: [Validators.required],
      asyncValidators: [UrlImageValidator()],
      updateOn: 'blur'
    })
  });

  onSubmit() {
    if (this.form.invalid) return;

    this.skeletonStore.show();

    this.api.saveProduct(this.form.value).subscribe({
      next: () => {
        this.skeletonStore.hide();
        this.toastStore.show({
          type: TOAST_CONSTANTS.ICONS.SUCCESS,
          message: 'Produto salvo!'
        });
      },
      error: () => {
        this.skeletonStore.hide();
        this.toastStore.show({
          type: TOAST_CONSTANTS.ICONS.ERROR,
          message: 'Erro ao salvar'
        });
      }
    });
  }
}
```

---

## 🧪 Executando Testes

```bash
# Testar apenas a biblioteca shared
pnpm test:shared

# Testar tudo
pnpm test

# Modo watch
pnpm test:watch

# Cobertura
pnpm test:coverage
```

### Exemplo de Teste

```typescript
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonComponent] // Standalone
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should emit click event', () => {
    const fixture = TestBed.createComponent(ButtonComponent);
    const component = fixture.componentInstance;

    jest.spyOn(component.clickEvent, 'emit');
    component.onClick();

    expect(component.clickEvent.emit).toHaveBeenCalled();
  });
});
```

---

## 🎯 Padrões e Boas Práticas

### 1. Componentes Standalone

```typescript
// ✅ Standalone (sem NgModules)
@Component({
  selector: 'app-button',
  imports: [FocusDirective],
  template: `
    ...
  `
})
export class ButtonComponent {}
```

### 2. Signals para Inputs/Outputs

```typescript
// ✅ Input/Output signals
export class ButtonComponent {
  text = input<string>();
  disabled = input<boolean>(false);
  clickEvent = output<void>();
}
```

### 3. OnPush Change Detection

```typescript
@Component({
  selector: 'app-button',
  changeDetection: ChangeDetectionStrategy.OnPush  // ✅
})
```

### 4. Design Tokens

```scss
// ✅ Usar tokens
.button {
  color: $color-primary;
  padding: $spacing-md;
}

// ❌ Valores hardcoded
.button {
  color: #0a3d6b;
  padding: 16px;
}
```

### 5. Tree-Shakeable

```typescript
// ✅ Importação específica
import { ButtonComponent } from '@shared/ui';

// ❌ Importar tudo
import * as Shared from '@shared/ui';
```

---

## 🤝 Contribuindo

Ao adicionar novos componentes ou utilitários:

1. **Classifique corretamente**: UI (atom/molecule/organism) ou Utils (directive/pipe/validator)
2. **Use Signals**: Para inputs, outputs e estado local
3. **Signal Stores**: Para estado global compartilhado
4. **Standalone**: Sempre componentes/diretivas standalone
5. **Design Tokens**: Use tokens para estilos
6. **OnPush**: Sempre use `ChangeDetectionStrategy.OnPush`
7. **Teste**: Adicione testes unitários
8. **Documente**: Exemplos de uso práticos
9. **Exporte**: Adicione ao `index.ts` apropriado

---

## 📚 Documentação Adicional

- [UI Components (Atomic Design)](./src/lib/ui/README.md)
- [Utils (Utilitários)](./src/lib/utils/README.md)
- [NgRx Signals](https://ngrx.io/guide/signals)
- [Atomic Design](https://atomicdesign.bradfrost.com/)

---

## 📊 Metadados da Biblioteca

```json
{
  "name": "shared",
  "version": "0.0.1",
  "peerDependencies": {
    "@angular/common": "^19.2.0",
    "@angular/core": "^19.2.0"
  },
  "sideEffects": false // ✅ Tree-shakeable
}
```

---

## 🎉 Conclusão

A biblioteca `shared` é um **sistema de design completo** que fornece:

✅ **50+ Componentes UI** organizados por Atomic Design  
✅ **4 Signal Stores Globais** para gerenciamento de estado (Toast, Modal, ModalRight, Skeleton)  
✅ **Diretivas Reutilizáveis** (Focus, Skeleton)  
✅ **Pipes de Transformação** (Truncate)  
✅ **Validadores Customizados** (UrlImage)  
✅ **Design Tokens Centralizados** (cores, espaçamentos, tipografia)  
✅ **Constantes Organizadas** (PRODUCT_CARD_CONSTANTS, BUTTON_CONSTANTS, etc.)  
✅ **Tree-Shakeable** (apenas código usado no bundle)  
✅ **Type-Safe** (tipagem forte em toda biblioteca)  
✅ **Testável** (cobertura completa com Jest)

A arquitetura modular e baseada em **NgRx Signal Store** torna o código **reativo**, **performático** e **fácil de manter**.

---

**Última atualização**: Outubro 2025  
**Versão**: 0.0.1
