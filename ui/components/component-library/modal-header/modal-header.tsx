import React from 'react';
import classnames from 'classnames';

import {
  TEXT_ALIGN,
  TextVariant,
} from '../../../helpers/constants/design-system';

import {
  HeaderBase,
  ButtonIcon,
  BUTTON_ICON_SIZES,
  ICON_NAMES,
  Text,
} from '..';

import { ModalHeaderProps } from './modal-header.types';

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  className = '',
  children,
  onClickCloseButton,
  closeButtonProps,
  onClickBackButton,
  backButtonProps,
  startAccessory,
  endAccessory,
  ...props
}) => {
  return (
    <HeaderBase
      className={classnames('mm-modal-header', className)}
      startAccessory={
        startAccessory ||
        (onClickBackButton && (
          <ButtonIcon
            iconName={ICON_NAMES.ARROW_LEFT}
            onClick={onClickBackButton}
            size={BUTTON_ICON_SIZES.SM}
            {...backButtonProps}
          />
        ))
      }
      endAccessory={
        endAccessory ||
        (onClickCloseButton && (
          <ButtonIcon
            iconName={ICON_NAMES.CLOSE}
            onClick={onClickCloseButton}
            size={BUTTON_ICON_SIZES.SM}
            {...closeButtonProps}
          />
        ))
      }
      {...props}
    >
      {typeof children === 'string' ? (
        <Text variant={TextVariant.headingSm} textAlign={TEXT_ALIGN.CENTER}>
          {children}
        </Text>
      ) : (
        children
      )}
    </HeaderBase>
  );
};
