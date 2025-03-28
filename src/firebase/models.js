// src/firebase/models.js

/**
 * @typedef {Object} CadavreExquisEntry
 * @property {string} id - Firestore ID
 * @property {number} number - Auto-assigned order
 * @property {string} title
 * @property {Array<{ name: string, voteCount: number, isRunnerUp: boolean }>} themes
 * @property {Array<{ text: string, playerUUID: string }>} paragraphs
 * @property {string} audioURL
 * @property {import('firebase/firestore').Timestamp} createdAt
 */

/**
 * @typedef {Object} Player
 * @property {string} uuid
 * @property {string} mainId
 * @property {string} name
 * @property {string} avatarURL
 * @property {string} color
 * @property {string} patternSeed
 * @property {string[]} emails
 */

/**
 * @typedef {Object} PlayerMapping
 * @property {string} mainId
 * @property {string[]} linkedUUIDs
 * @property {string[]} emails
 * @property {string[]} names
 */
