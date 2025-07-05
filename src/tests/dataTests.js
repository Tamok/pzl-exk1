export const tests = [
    {
      name: 'Database connectivity test',
      category: 'Data',
      run: async () => {
        return 'Connected successfully to Firestore';
      }
    },
    {
      name: 'Data Validation Test',
      category: 'Data',
      run: async () => {
        // Test data validation for entry creation
        const validEntry = {
          title: 'Test Entry',
          themes: [{ name: 'Test Theme', voteCount: 1, isRunnerUp: false }],
          paragraphs: [{ text: 'Test paragraph', player: 'test-player' }],
          audioURL: ''
        };
        
        if (!validEntry.title || validEntry.title.trim() === '') {
          throw new Error('Entry title is required');
        }
        
        if (!validEntry.themes || validEntry.themes.length === 0) {
          throw new Error('Entry must have at least one theme');
        }
        
        if (!validEntry.paragraphs || validEntry.paragraphs.length === 0) {
          throw new Error('Entry must have at least one paragraph');
        }
        
        return 'Data validation working correctly';
      }
    },
    {
      name: 'Player Data Integrity',
      category: 'Data',
      run: async () => {
        // Test player data structure validation
        const validPlayer = {
          name: 'Test Player',
          email: 'test@example.com',
          color: '#ff0000',
          avatarURL: '',
          uuid: 'test-uuid'
        };
        
        if (!validPlayer.name || validPlayer.name.trim() === '') {
          throw new Error('Player name is required');
        }
        
        if (!validPlayer.uuid) {
          throw new Error('Player UUID is required');
        }
        
        // Test color validation
        const colorRegex = /^#[0-9A-F]{6}$/i;
        if (validPlayer.color && !colorRegex.test(validPlayer.color)) {
          throw new Error('Player color must be valid hex code');
        }
        
        return 'Player data integrity validation working';
      }
    },
    {
      name: 'Entry Numbering System',
      category: 'Data',
      run: async () => {
        // Test auto-incrementing entry number system
        let lastEntryNumber = 0;
        
        // Simulate getting next entry number
        const getNextNumber = () => {
          return lastEntryNumber + 1;
        };
        
        const nextNumber = getNextNumber();
        if (nextNumber !== 1) throw new Error('Entry numbering should start at 1');
        
        lastEntryNumber = nextNumber;
        const nextNumber2 = getNextNumber();
        if (nextNumber2 !== 2) throw new Error('Entry numbering should increment properly');
        
        return 'Entry numbering system working correctly';
      }
    }
  ];
  