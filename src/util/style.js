export function degXmlToCss(type, deg) {
  if (typeof type !== 'string') {
    throw new Error('Invalid `type` parameter');
  }

  switch (type) {
    case 'tile':
    case 'roadSign':
      return Math.abs(deg) === 90 ? deg * -1 : deg;
    case 'parkingSpace':
      switch (deg) {
        case 0:
          return -90;
        case 90:
          return 180;
        case 180:
          return 90;
        default:
          return deg;
      }
    default:
      return deg;
  }
}

export function degCssToXml(type, deg) {
  if (typeof type !== 'string') {
    throw new Error('Invalid `type` parameter');
  }

  switch (type) {
    case 'tile':
      switch (deg) {
        case 90:
        case -90:
          return deg * -1;
        case 270:
          return 90;
        case 360:
          return 0;
        default:
          return deg;
      }
    default:
      return deg;
  }
}
