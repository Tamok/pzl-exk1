import { createEntry, updateEntry, deleteEntry } from '../firebase/services/entries.js';

export const tests = [
  {
    name: 'Entry CRUD',
    category: 'Data',
    run: async () => {
      const id = await createEntry({
        title: 'Test Entry',
        themes: [],
        paragraphs: [],
        audioURL: ''
      });
      await updateEntry(id, { title: 'Updated Test Entry' });
      await deleteEntry(id);
      return 'Created, updated, and deleted entry successfully';
    }
  }
];
