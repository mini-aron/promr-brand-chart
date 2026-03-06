/** @jsxImportSource @emotion/react */
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { MultipleSelect } from '@/components/Common/Select';
import type { Option } from '@/components/Common/Select';

const options: Option[] = [
  { label: 'A법인', value: 'corp-1' },
  { label: 'B법인', value: 'corp-2' },
  { label: 'C법인', value: 'corp-3' },
  { label: 'D법인', value: 'corp-4' },
];

const meta: Meta<typeof MultipleSelect> = {
  component: MultipleSelect,
  title: 'Common/MultipleSelect',
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    enableSearch: { control: 'boolean' },
    size: { control: 'select', options: ['default', 'large'] },
  },
};

export default meta;

type Story = StoryObj<typeof MultipleSelect>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<(string | number)[]>([]);
    return (
      <div style={{ width: 280 }}>
        <MultipleSelect
          {...args}
          options={options}
          selectedItems={selected}
          onChange={setSelected}
        />
      </div>
    );
  },
  args: { placeholder: '법인 다중 선택', enableSearch: false },
};
