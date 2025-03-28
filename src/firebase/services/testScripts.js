import { createEntry, updateEntry, deleteEntry,  } from './entries';
import { createPlayer, updatePlayer, deletePlayer,  } from './players';
import { mergePlayers, getPlayerMapping } from './playerMappings';
import { runAllMigrations } from './migrations';
import { logEvent } from '../../utils/logger';

export const testEntryLifecycle = async () => {
  const id = await createEntry({
    title: 'TEST ENTRY',
    themes: [{ name: 'Test Theme', voteCount: 1, isRunnerUp: false }],
    paragraphs: [],
    audioURL: '',
  });
  await updateEntry(id, { title: 'UPDATED ENTRY' });
  await deleteEntry(id);
  logEvent('TEST', 'Entry lifecycle test completed.');
};

export const testPlayerLifecycle = async () => {
  const uuid = await createPlayer({ name: 'Test Player' });
  await updatePlayer(uuid, { color: '#123456' });
  await deletePlayer(uuid);
  logEvent('TEST', 'Player lifecycle test completed.');
};

export const testMergePlayers = async () => {
  const a = await createPlayer({ name: 'Merge A', emails: ['a@x.com'] });
  const b = await createPlayer({ name: 'Merge B', emails: ['b@x.com'] });
  const mainId = await mergePlayers([a, b]);
  const mapping = await getPlayerMapping(mainId);
  logEvent('TEST', `Merge test complete. Mapped: ${JSON.stringify(mapping)}`);
};

export const testMigrations = async () => {
  await runAllMigrations();
  logEvent('TEST', 'Migration test completed.');
};
