

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
