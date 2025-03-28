// utils/formDefaults.js
import { v4 as uuidv4 } from 'uuid';

export const defaultSlateText = () => [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export const newParagraph = () => ({
  id: uuidv4(),
  text: defaultSlateText(),
  player: '',
});
