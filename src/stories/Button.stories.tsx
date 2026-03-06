/** @jsxImportSource @emotion/react */
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/Common/Button';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Common/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger', 'menu'],
    },
    size: {
      control: 'select',
      options: ['default', 'small', 'icon', 'menu'],
    },
    disabled: { control: 'boolean' },
    active: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary', children: '저장' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: '취소' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', children: '더보기' },
};

export const Danger: Story = {
  args: { variant: 'danger', children: '삭제' },
};

export const Small: Story = {
  args: { variant: 'primary', size: 'small', children: '작은 버튼' },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: '비활성', disabled: true },
};

export const Menu: Story = {
  args: { variant: 'menu', children: '메뉴 항목', active: false },
};

export const MenuActive: Story = {
  args: { variant: 'menu', children: '선택된 메뉴', active: true },
};
