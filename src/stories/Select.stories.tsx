import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SingleSelect } from '@/components/Common/Select';
import type { Option } from '@/components/Common/Select';

const options: Option[] = [
  { label: 'A법인', value: 'corp-1' },
  { label: 'B법인', value: 'corp-2' },
  { label: 'C법인', value: 'corp-3' },
  { label: 'D법인', value: 'corp-4' },
];

const optionsWithDescription: Option[] = [
  { label: '제품A', value: 'P001', description: '품목코드 P001' },
  { label: '제품B', value: 'P002', description: '품목코드 P002' },
  { label: '제품C', value: 'P003', description: '품목코드 P003' },
];

const meta: Meta<typeof SingleSelect> = {
  component: SingleSelect,
  title: 'Common/SingleSelect',
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    enableSearch: { control: 'boolean' },
    size: { control: 'select', options: ['default', 'large'] },
  },
};

export default meta;

type Story = StoryObj<typeof SingleSelect>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string | number | null>(null);
    return (
      <div style={{ width: 280 }}>
        <SingleSelect
          {...args}
          options={options}
          selected={selected}
          onChange={(v) => setSelected(v)}
        />
      </div>
    );
  },
  args: { placeholder: '법인 선택', enableSearch: false, size: 'default' },
};

export const WithSearch: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string | number | null>(null);
    return (
      <div style={{ width: 280 }}>
        <SingleSelect
          {...args}
          options={optionsWithDescription}
          selected={selected}
          onChange={(v) => setSelected(v)}
        />
      </div>
    );
  },
  args: { placeholder: '품목 선택', enableSearch: true, size: 'default' },
};

export const Large: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string | number | null>('corp-2');
    return (
      <div style={{ width: 320 }}>
        <SingleSelect
          {...args}
          options={options}
          selected={selected}
          onChange={(v) => setSelected(v)}
        />
      </div>
    );
  },
  args: { placeholder: '옵션 선택', size: 'large' },
};
