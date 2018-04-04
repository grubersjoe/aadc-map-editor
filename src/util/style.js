import { XmlTags } from '../services/Xml';

export function degXmlToCss(type, deg) {
  if (typeof type !== 'string') {
    throw new Error('Invalid `type` parameter');
  }

  switch (type) {
    case XmlTags.TILE:
    case XmlTags.ROAD_SIGN:
      return Math.abs(deg) === 90 ? deg * -1 : deg;
    default:
      return deg;
  }
}

export function degCssToXml(type, deg) {
  if (typeof type !== 'string') {
    throw new Error('Invalid `type` parameter');
  }

  switch (type) {
    case XmlTags.TILE:
      switch (deg) {
        case Math.abs(deg) === 90:
          return deg * -1;
        case 270:
          return 90;
        case 360:
          return 0;
        default:
          return deg;
      }
    case XmlTags.ROAD_SIGN:
    case XmlTags.PEDESTRIAN_CROSSING:
      return Math.abs(deg) === 90 ? deg * -1 : deg;
    default:
      return deg;
  }
}
