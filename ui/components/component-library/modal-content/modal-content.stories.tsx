import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { ModalContent } from './modal-content';
import { ModalContentSize } from './modal-content.types';

import README from './README.mdx';

export default {
  title: 'Components/ComponentLibrary/ModalContent',
  component: ModalContent,
  parameters: {
    docs: {
      page: README,
    },
  },
  argTypes: {
    className: {
      control: 'text',
    },
    children: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: Object.values(ModalContentSize).map((value) =>
        value.toLowerCase(),
      ),
    },
  },
  args: {
    children: 'Modal Content',
  },
} as ComponentMeta<typeof ModalContent>;

const Template: ComponentStory<typeof ModalContent> = (args) => (
  <ModalContent {...args} />
);

export const DefaultStory = Template.bind({});
DefaultStory.storyName = 'Default';

export const Children = Template.bind({});

export const Size: ComponentStory<typeof ModalContent> = (args) => (
  <>
    <ModalContent {...args} size={ModalContentSize.Sm} marginBottom={4}>
      ModalContentSize.Sm
    </ModalContent>
    <ModalContent {...args} size={ModalContentSize.Md} marginBottom={4}>
      ModalContentSize.Md
    </ModalContent>
    <ModalContent {...args} size={ModalContentSize.Lg} marginBottom={4}>
      ModalContentSize.Lg
    </ModalContent>
  </>
);
