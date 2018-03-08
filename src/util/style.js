export function rotTransformToDeg(obj) {
  const matrix = obj.style.transform;

  if (matrix === 'none') {
    return 0;
  }

  const values = matrix.split('(')[1].split(')')[0].split(',');
  const a = parseFloat(values[0]);
  const b = parseFloat(values[1]);
  const angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));

  return angle < 0 ? angle + 360 : angle;
}

export function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export function degXmlToCss(type, deg) {
  switch (type) {
    case 'tile':
      return Math.abs(deg) === 90 ? deg * -1 : deg;
    case 'roadSign':
      switch (deg) {
        case 0:
          return 90;
        case 90:
          return 0;
        case -90:
          return 180;
        case 180:
          return -90;
        default:
          return deg;
      }
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

export function correctDegWebToXml(deg, key) {
  switch (key) {
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
