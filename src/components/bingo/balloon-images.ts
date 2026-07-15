import type { ImageSourcePropType } from 'react-native';

/**
 * Local photo per bingo tile id (assets/balloons/<tile-id>.jpeg).
 * Lives in the UI layer so the card data stays plain (and node-runnable).
 * When the CMS lands it will serve image URLs on the tile itself and this
 * mapping disappears. Tiles without a photo fall back to their emoji.
 */
export const balloonImages: Partial<Record<string, ImageSourcePropType>> = {
  poppke: require('@/assets/balloons/poppke.jpg'),
  sinneblom: require('@/assets/balloons/sinneblom.jpeg'),
  lieveheersbeestje: require('@/assets/balloons/lieveheersbeestje.jpeg'),
  schildpad: require('@/assets/balloons/schildpad.jpeg'),
  lachebek: require('@/assets/balloons/lachebek.jpeg'),
  'oranje-kater': require('@/assets/balloons/oranje-kater.jpeg'),
  'rode-vier': require('@/assets/balloons/rode-vier.jpeg'),
  regenboog: require('@/assets/balloons/regenboog.jpeg'),
  'blauwe-reus': require('@/assets/balloons/blauwe-reus.jpeg'),
};
