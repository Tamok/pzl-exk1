import { createPlayer, updatePlayer, deletePlayer } from '../firebase/services/players';
import { mergePlayers, getPlayerMapping } from '../firebase/services/playerMappings';

export const tests = [
  {
    name: 'Player CRUD',
    category: 'Data',
    run: async () => {
      const uuid = await createPlayer({ name: 'Test Player' });
      await updatePlayer(uuid, { color: '#ff00ff' });
      await deletePlayer(uuid);
      return 'Created, updated, and deleted player';
    }
  },
  {
    name: 'Player Merge',
    category: 'Data',
    run: async () => {
      const a = await createPlayer({ name: 'Merge A' });
      const b = await createPlayer({ name: 'Merge B' });
      const mainId = await mergePlayers([a, b]);
  
      const mapping = await getPlayerMapping(mainId);
      if (!mapping || mapping.linkedUUIDs.length < 2) {
        throw new Error('Mapping failed');
      }
  
      // Clean up test players
      await deletePlayer(a);
      await deletePlayer(b);
  
      return 'Merged players and deleted test profiles';
    }
  }
  
];
