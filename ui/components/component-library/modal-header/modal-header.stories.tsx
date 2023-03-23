import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { Text } from '..';
import { ModalHeader } from './modal-header';

import README from './README.mdx';

export default {
  title: 'Components/ComponentLibrary/ModalHeader',
  component: ModalHeader,
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
    onClickCloseButton: {
      action: 'onClickCloseButton',
    },
    onClickBackButton: {
      action: 'onClickBackButton',
    },
  },
  args: {
    children: 'Modal Header',
  },
} as ComponentMeta<typeof ModalHeader>;

const Template: ComponentStory<typeof ModalHeader> = (args) => (
  <ModalHeader {...args} />
);

export const DefaultStory = Template.bind({});
DefaultStory.storyName = 'Default';

export const Children = Template.bind({});
Children.args = {
  onClickBackButton: null,
  onClickCloseButton: null,
};

export const onClickCloseButton = Template.bind({});
onClickCloseButton.args = {
  onClickBackButton: null,
};

export const onClickBackButton = Template.bind({});
onClickBackButton.args = {
  onClickCloseButton: null,
};

export const StartAccessoryAndEndAccessory = Template.bind({});
StartAccessoryAndEndAccessory.args = {
  startAccessory: <Text>Start Accessory</Text>,
  endAccessory: <Text>End Accessory</Text>,
};
