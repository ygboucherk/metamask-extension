import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import classnames from 'classnames';

import {
  AlignItems,
  BLOCK_SIZES,
  DISPLAY,
  JustifyContent,
} from '../../../helpers/constants/design-system';

import Box from '../../ui/box/box';

import { ModalProps } from './modal.types';

export const Modal: React.FC<ModalProps> = ({
  className = '',
  isOpen,
  onClose,
  children,
  modalRef = null,
  isScrollable = false,
  closeOnOutsideClick = true,
  closeOnEscapeKey = true,
  ...props
}) => {
  useEffect(() => {
    if (isOpen && !isScrollable) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isOpen]);

  const handleEscKey = (event: KeyboardEvent) => {
    if (closeOnEscapeKey && event.key === 'Escape') {
      onClose();
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (closeOnOutsideClick) {
      if (typeof modalRef === 'function') {
        modalRef(null);
      } else if (
        modalRef?.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return isOpen
    ? ReactDOM.createPortal(
        <Box
          className={classnames('mm-modal', className)}
          role="dialog"
          aria-modal="true"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onClose();
            }
          }}
          display={DISPLAY.FLEX}
          justifyContent={JustifyContent.center}
          alignItems={AlignItems.center}
          width={BLOCK_SIZES.FULL}
          height={BLOCK_SIZES.FULL}
          padding={4}
          {...props}
        >
          {children}
        </Box>,
        document.body,
      )
    : null;
};

export default Modal;
