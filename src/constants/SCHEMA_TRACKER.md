# 🔧 SCHEMA TRACKER (Internal)

## Version: 6

### Entry Schema Fields (cadavres_exquis):
- number: Integer
- title: String
- themes: [{ name, voteCount, isRunnerUp }]
- paragraphs: [{ text, player (UUID), id (UUID) }]
- soundUrl: String (optional)
- createdAt: Timestamp (server-side)

### Player Schema Fields:
- name: String
- email: String (optional)
- uuid: String (primary ID)
- color: Hex Color
- patternSeed: String
- avatarUrl: String (optional)
- createdAt: Timestamp

### Change History:
- v6: Added paragraph `id` UUIDs (for emoji reactions, individual refs)
- v5: Initial live schema w/ sound file, player UUIDs, etc.
