/* eslint-disable jest/require-top-level-describe */
import { render } from '@testing-library/react';
import React from 'react';

import { Modal } from './modal';

describe('Modal', () => {
  it('should render with text inside the Modal', () => {
    const { getByText } = render(<Modal isOpen>modal</Modal>);
    expect(getByText('modal')).toBeDefined();
    expect(getByText('modal')).toHaveClass('mm-modal');
  });
  it('should match snapshot', () => {
    const { container } = render(<Modal isOpen>modal</Modal>);
    expect(container).toMatchSnapshot();
  });
  it('should render with and additional className', () => {
    const { getByText } = render(
      <Modal isOpen className="test-class">
        modal
      </Modal>,
    );
    expect(getByText('modal')).toHaveClass('mm-modal test-class');
  });
});
