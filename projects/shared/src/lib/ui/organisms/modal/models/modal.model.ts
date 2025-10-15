export interface ModalModel {
  title: string;
  content: string;
  buttons: { label: string; action: string; icon?: string }[];
}

export interface ModalState {
  isOpen: boolean;
  data: ModalModel | undefined;
}

export type ModalCloseCallback = (action?: string) => void;
