export interface ModalRightModel {
  title: string;
}

export interface ModalRightState {
  isOpen: boolean;
  isClosing: boolean;
  data: ModalRightModel;
}

export type ModalRightCloseCallback = () => void;

export const MODAL_RIGHT_CONSTANTS = {
  ANIMATION_DURATION: 500
} as const;
