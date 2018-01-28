export function formatXml(xml) {
  const PADDING = ' '.repeat(2);
  const reg = /(>)(<)(\/*)/g;
  let pad = 0;


  return xml
    .replace(reg, '$1\r\n$2$3')
    .split('\r\n').map((node) => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/) && pad > 0) {
        pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) { // TODO: check this error
        indent = 1;
      } else {
        indent = 0;
      }

      pad += indent;

      return PADDING.repeat(pad - indent) + node;
    }).join('\r\n');
}

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
