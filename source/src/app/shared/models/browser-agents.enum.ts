/**
 * These enums only contain the targeted name of the user agent string.
 *
 * Usage: navigator.userAgent.includes(BrowserAgents.IE11) => boolean
 */
export enum BrowserAgents {
  IE11 = 'Trident',
  Chrome = 'Chrome',
  FireFox = 'FireFox',
  Edge = 'Edge'
}
