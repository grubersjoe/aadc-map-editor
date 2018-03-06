export const XmlTags = Object.freeze({
  TILE: 'tile',
  ROAD_SIGN: 'roadSign',
});

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
      } else if (node.match(/^<\w[^>]*[^]>.*$/)) { // TODO: check this error
        indent = 1;
      } else {
        indent = 0;
      }

      pad += indent;

      return PADDING.repeat(pad - indent) + node;
    }).join('\r\n');
}
