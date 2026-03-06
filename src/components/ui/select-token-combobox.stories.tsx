import { Meta, StoryObj } from '@storybook/nextjs-vite';
import SelectCombobox from './select-token-combobox';

const meta = {
  title: 'UI/SelectTokenCombobox',
  component: SelectCombobox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    label: { control: 'text' },
  },
  args: {
    className: 'w-xs',
    label: 'Select Token',
    placeholder: 'Select Token',
    data: [],
    isLoading: false,
    onSelect: token => {
      console.log('onSelect', token);
    },
    onNotFound: search => {
      console.log('onNotFound', search);
    },
    onScrollEnd: () => {
      console.log('onScrollEnd');
    },
  },
} satisfies Meta<typeof SelectCombobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Select Token',
    data: [
      {
        image: 'https://dummyimage.com/60x60/000/fff',
        name: 'Token 1',
        symbol: 'TKN1',
        description: 'Token 1 description',
      },
      {
        image: 'https://dummyimage.com/60x60/000/fff',
        name: 'Token 2',
        symbol: 'TKN2',
        description: 'Token 2 description',
      },
      {
        image: 'https://dummyimage.com/60x60/000/fff',
        name: 'Token 3',
        symbol: 'TKN3',
        description: 'Token 3 description',
      },
    ],
    isLoading: false,
    onSelect: token => {
      console.log('onSelect', token);
    },
    onNotFound: search => {
      console.log('onNotFound', search);
    },
    onScrollEnd: () => {
      console.log('onScrollEnd');
    },
  },
} satisfies Story;
