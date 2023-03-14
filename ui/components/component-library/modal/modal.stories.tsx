import React from 'react';
import { useArgs } from '@storybook/client-api';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import {
  DISPLAY,
  JustifyContent,
  AlignItems,
  TEXT_ALIGN,
  TextVariant,
  BLOCK_SIZES,
} from '../../../helpers/constants/design-system';

import Box from '../../ui/box';

import { ModalOverlay, ModalContent, Text, Button, BUTTON_TYPES } from '..';
import { Modal } from './modal';

import README from './README.mdx';

export default {
  title: 'Components/ComponentLibrary/Modal',
  component: Modal,
  parameters: {
    docs: {
      page: README,
    },
  },
  argTypes: {
    children: {
      control: 'text',
    },
    className: {
      control: 'text',
    },
    isOpen: {
      control: 'boolean',
    },
    onClose: {
      action: 'onClose',
    },
    modalRef: {
      control: 'func',
    },
    isScrollable: {
      control: 'boolean',
      description:
        'The isScrollable prop allows for the background content to be scrollable when the modal is open. ONLY WORKS IF STORY IS IN NEW TAB',
    },
    closeOnOutsideClick: {
      control: 'boolean',
    },
    closeOnEscapeKey: {
      control: 'boolean',
    },
  },
  args: {
    children:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus posuere nunc enim, quis efficitur dolor tempus viverra. Vivamus pharetra tempor pulvinar. Sed at dui in nisi fermentum volutpat. Proin ut tortor quis eros tincidunt molestie. Suspendisse dictum ex vitae metus consequat, et efficitur dolor luctus. Integer ultricies hendrerit turpis sed faucibus. Nam pellentesque metus a turpis sollicitudin vehicula. Phasellus rutrum luctus pulvinar. Phasellus quis accumsan urna. Praesent justo erat, bibendum ac volutpat ac, placerat in dui. Cras gravida mi et risus feugiat vulputate. Integer vulputate diam eu vehicula euismod. In laoreet quis eros sed tincidunt. Pellentesque purus dui, luctus id sem sit amet, varius congue dui',
  },
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [{ isOpen }, updateArgs] = useArgs();
  const handleOnClick = () => {
    updateArgs({ isOpen: true });
  };
  const handleOnClose = () => {
    updateArgs({ isOpen: false });
  };
  return (
    <Box
      width={BLOCK_SIZES.FULL}
      style={{ maxWidth: '700px' }}
      marginLeft="auto"
      marginRight="auto"
    >
      <Button onClick={handleOnClick} variant={BUTTON_TYPES.PRIMARY}>
        OpenModal
      </Button>
      <Modal
        {...args}
        modalRef={modalRef}
        isOpen={isOpen}
        onClose={handleOnClose}
      >
        <ModalOverlay />
        <ModalContent ref={modalRef}>
          {/* TODO: Replace with ModalHeader component */}
          <Box
            className="mm-modal-header"
            display={DISPLAY.FLEX}
            justifyContent={JustifyContent.spaceBetween}
            alignItems={AlignItems.flexStart}
            width={BLOCK_SIZES.FULL}
            marginBottom={4}
          >
            <button onClick={handleOnClose}>Back</button>
            <Text variant={TextVariant.headingSm} textAlign={TEXT_ALIGN.CENTER}>
              Modal Header
            </Text>
            <button onClick={handleOnClose}>Close</button>
          </Box>
          <Text>{args.children}</Text>
        </ModalContent>
      </Modal>
      {args.isScrollable && (
        <>
          <Text marginBottom={8} marginTop={8}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            posuere nunc enim, quis efficitur dolor tempus viverra. Vivamus
            pharetra tempor pulvinar. Sed at dui in nisi fermentum volutpat.
            Proin ut tortor quis eros tincidunt molestie. Suspendisse dictum ex
            vitae metus consequat, et efficitur dolor luctus. Integer ultricies
            hendrerit turpis sed faucibus. Nam pellentesque metus a turpis
            sollicitudin vehicula. Phasellus rutrum luctus pulvinar. Phasellus
            quis accumsan urna. Praesent justo erat, bibendum ac volutpat ac,
            placerat in dui. Cras gravida mi et risus feugiat vulputate. Integer
            vulputate diam eu vehicula euismod. In laoreet quis eros sed
            tincidunt. Pellentesque purus dui, luctus id sem sit amet, varius
            congue dui
          </Text>
          <Text marginBottom={8}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            posuere nunc enim, quis efficitur dolor tempus viverra. Vivamus
            pharetra tempor pulvinar. Sed at dui in nisi fermentum volutpat.
            Proin ut tortor quis eros tincidunt molestie. Suspendisse dictum ex
            vitae metus consequat, et efficitur dolor luctus. Integer ultricies
            hendrerit turpis sed faucibus. Nam pellentesque metus a turpis
            sollicitudin vehicula. Phasellus rutrum luctus pulvinar. Phasellus
            quis accumsan urna. Praesent justo erat, bibendum ac volutpat ac,
            placerat in dui. Cras gravida mi et risus feugiat vulputate. Integer
            vulputate diam eu vehicula euismod. In laoreet quis eros sed
            tincidunt. Pellentesque purus dui, luctus id sem sit amet, varius
            congue dui
          </Text>
          <Text marginBottom={8}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            posuere nunc enim, quis efficitur dolor tempus viverra. Vivamus
            pharetra tempor pulvinar. Sed at dui in nisi fermentum volutpat.
            Proin ut tortor quis eros tincidunt molestie. Suspendisse dictum ex
            vitae metus consequat, et efficitur dolor luctus. Integer ultricies
            hendrerit turpis sed faucibus. Nam pellentesque metus a turpis
            sollicitudin vehicula. Phasellus rutrum luctus pulvinar. Phasellus
            quis accumsan urna. Praesent justo erat, bibendum ac volutpat ac,
            placerat in dui. Cras gravida mi et risus feugiat vulputate. Integer
            vulputate diam eu vehicula euismod. In laoreet quis eros sed
            tincidunt. Pellentesque purus dui, luctus id sem sit amet, varius
            congue dui
          </Text>
          <Text marginBottom={8}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            posuere nunc enim, quis efficitur dolor tempus viverra. Vivamus
            pharetra tempor pulvinar. Sed at dui in nisi fermentum volutpat.
            Proin ut tortor quis eros tincidunt molestie. Suspendisse dictum ex
            vitae metus consequat, et efficitur dolor luctus. Integer ultricies
            hendrerit turpis sed faucibus. Nam pellentesque metus a turpis
            sollicitudin vehicula. Phasellus rutrum luctus pulvinar. Phasellus
            quis accumsan urna. Praesent justo erat, bibendum ac volutpat ac,
            placerat in dui. Cras gravida mi et risus feugiat vulputate. Integer
            vulputate diam eu vehicula euismod. In laoreet quis eros sed
            tincidunt. Pellentesque purus dui, luctus id sem sit amet, varius
            congue dui
          </Text>
          <Text marginBottom={8}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            posuere nunc enim, quis efficitur dolor tempus viverra. Vivamus
            pharetra tempor pulvinar. Sed at dui in nisi fermentum volutpat.
            Proin ut tortor quis eros tincidunt molestie. Suspendisse dictum ex
            vitae metus consequat, et efficitur dolor luctus. Integer ultricies
            hendrerit turpis sed faucibus. Nam pellentesque metus a turpis
            sollicitudin vehicula. Phasellus rutrum luctus pulvinar. Phasellus
            quis accumsan urna. Praesent justo erat, bibendum ac volutpat ac,
            placerat in dui. Cras gravida mi et risus feugiat vulputate. Integer
            vulputate diam eu vehicula euismod. In laoreet quis eros sed
            tincidunt. Pellentesque purus dui, luctus id sem sit amet, varius
            congue dui
          </Text>
          <Text marginBottom={8}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            posuere nunc enim, quis efficitur dolor tempus viverra. Vivamus
            pharetra tempor pulvinar. Sed at dui in nisi fermentum volutpat.
            Proin ut tortor quis eros tincidunt molestie. Suspendisse dictum ex
            vitae metus consequat, et efficitur dolor luctus. Integer ultricies
            hendrerit turpis sed faucibus. Nam pellentesque metus a turpis
            sollicitudin vehicula. Phasellus rutrum luctus pulvinar. Phasellus
            quis accumsan urna. Praesent justo erat, bibendum ac volutpat ac,
            placerat in dui. Cras gravida mi et risus feugiat vulputate. Integer
            vulputate diam eu vehicula euismod. In laoreet quis eros sed
            tincidunt. Pellentesque purus dui, luctus id sem sit amet, varius
            congue dui
          </Text>
          <Text marginBottom={8}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            posuere nunc enim, quis efficitur dolor tempus viverra. Vivamus
            pharetra tempor pulvinar. Sed at dui in nisi fermentum volutpat.
            Proin ut tortor quis eros tincidunt molestie. Suspendisse dictum ex
            vitae metus consequat, et efficitur dolor luctus. Integer ultricies
            hendrerit turpis sed faucibus. Nam pellentesque metus a turpis
            sollicitudin vehicula. Phasellus rutrum luctus pulvinar. Phasellus
            quis accumsan urna. Praesent justo erat, bibendum ac volutpat ac,
            placerat in dui. Cras gravida mi et risus feugiat vulputate. Integer
            vulputate diam eu vehicula euismod. In laoreet quis eros sed
            tincidunt. Pellentesque purus dui, luctus id sem sit amet, varius
            congue dui
          </Text>
          <Text marginBottom={8}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            posuere nunc enim, quis efficitur dolor tempus viverra. Vivamus
            pharetra tempor pulvinar. Sed at dui in nisi fermentum volutpat.
            Proin ut tortor quis eros tincidunt molestie. Suspendisse dictum ex
            vitae metus consequat, et efficitur dolor luctus. Integer ultricies
            hendrerit turpis sed faucibus. Nam pellentesque metus a turpis
            sollicitudin vehicula. Phasellus rutrum luctus pulvinar. Phasellus
            quis accumsan urna. Praesent justo erat, bibendum ac volutpat ac,
            placerat in dui. Cras gravida mi et risus feugiat vulputate. Integer
            vulputate diam eu vehicula euismod. In laoreet quis eros sed
            tincidunt. Pellentesque purus dui, luctus id sem sit amet, varius
            congue dui
          </Text>
        </>
      )}
    </Box>
  );
};
export const DefaultStory = Template.bind({});
DefaultStory.storyName = 'Default';

export const IsOpen = Template.bind({});

export const OnClose = Template.bind({});

export const Children = Template.bind({});

export const ModalRef = Template.bind({});

export const IsScrollable = Template.bind({});
IsScrollable.args = {
  isScrollable: true,
};

export const CloseOnOutsideClick = Template.bind({});
CloseOnOutsideClick.args = {
  closeOnOutsideClick: true,
};

export const CloseOnEscapeKey = Template.bind({});
CloseOnEscapeKey.args = {
  closeOnEscapeKey: true,
};
