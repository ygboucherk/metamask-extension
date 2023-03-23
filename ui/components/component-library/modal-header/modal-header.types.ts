import { HeaderBaseProps } from '../header-base';
import { ButtonIconProps } from '../button-icon/button-icon.d';

type OptionalButtonIconProps = Partial<ButtonIconProps>;

export interface ModalHeaderProps extends HeaderBaseProps {
  /**
   * The onClose event handler for the ModalHeader
   */
  onClickCloseButton?: () => void;
  /**
   * The props to apply to the close button ButtonIcon
   */
  closeButtonProps?: OptionalButtonIconProps;
  /**
   * The onBack event handler for the ModalHeader
   */
  onClickBackButton?: () => void;
  /**
   * The props to apply to the back button ButtonIcon
   */
  backButtonProps?: OptionalButtonIconProps;
  /**
   * Replaces the back button with a custom element
   */
  startAccessory?: React.ReactNode;
  /**
   * Replaces the close button with a custom element
   */
  endAccessory?: React.ReactNode;
  /**
   * The children is the title area of the ModalHeader
   */
  children?: React.ReactNode;
  /**
   * An additional className to apply to the ModalHeader
   */
  className?: string;
}
