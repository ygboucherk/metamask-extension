type DivRef =
  | React.RefObject<HTMLDivElement>
  | ((instance: HTMLDivElement | null) => void);

export type ModalProps = {
  /**
   * If the modal is open or not
   */
  isOpen: boolean;
  /**
   * Fires when the modal is closed
   */
  onClose: () => void;
  /**
   * The element to be rendered inside the modal
   */
  children: React.ReactNode;
  /**
   * The class name to be applied to the modal
   */
  className?: string;
  /**
   * The modalRef allows for the modal to be closed when the user clicks outside of the modal
   * You should apply this ref to ModalContent or the equivalent element
   */
  modalRef?: DivRef;
  /**
   * The isScrollable prop allows for the background content to be scrollable when the modal is open
   * Set to false by default
   */
  isScrollable?: boolean;
  /**
   * closeOnOutsideClick enables the ability to close the modal when the user clicks outside of the modal
   * Set to true by default.
   */
  closeOnOutsideClick?: boolean;
  /**
   * closeOnEscape enables the ability to close the modal when the user presses the escape key
   * If this is disabled there should be a close button in the modal or allow keyboard only users to close the modal with a button that is accessible via the tab key
   * Set to true by default.
   */
  closeOnEscapeKey?: boolean;
};
