/* eslint-disable jest/require-top-level-describe */
import { render } from '@testing-library/react';
import React from 'react';

import { ModalHeader } from './modal-header';

describe('ModalHeader', () => {
  it('should render with text inside the ModalHeader', () => {
    const { getByText, getByTestId } = render(
      <ModalHeader data-testid="test">modal header</ModalHeader>,
    );
    expect(getByText('modal header')).toBeDefined();
    expect(getByTestId('test')).toHaveClass('mm-modal-header');
  });
  it('should match snapshot', () => {
    const { container } = render(<ModalHeader>modal header</ModalHeader>);
    expect(container).toMatchSnapshot();
  });
  it('should render with and additional className', () => {
    const { getByTestId } = render(
      <ModalHeader data-testid="test" className="test">
        modal header
      </ModalHeader>,
    );
    expect(getByTestId('test')).toHaveClass('test');
  });
  it('should render with react nodes inside the ModalHeader', () => {
    const { getByText } = render(
      <ModalHeader>
        <span>modal header</span>
      </ModalHeader>,
    );
    expect(getByText('modal header')).toBeDefined();
  });
});
