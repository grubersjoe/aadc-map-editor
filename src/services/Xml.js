import { MapElemOrigin, MapElemType } from '../components/MapElem';
import { degCssToXml, degXmlToCss } from '../util/style';

export const XmlTags = Object.freeze({
  TILE: 'tile',
  ROAD_SIGN: 'roadSign',
  PEDESTRIAN_CROSSING: 'pedestrianCrossing',
  PARKING_SPACE: 'parkingSpace',
});

export function parseXml(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');

  if (doc.getElementsByTagName('parsererror').length) {
    throw new Error('Unable to parse given XML data (malformed)!');
  }

  return doc;
}

export function parseXmlTags(xmlString, tagNames) {
  const xmlDoc = parseXml(xmlString);
  const nodes = [...xmlDoc.querySelectorAll(tagNames.join())];

  if (!nodes.length) {
    throw new Error(`No <${tagNames}> tags found!`);
  }

  return nodes.map(node => ({
    x: parseFloat(node.getAttribute('x')),
    y: parseFloat(node.getAttribute('y')),
    dir: degXmlToCss(XmlTags.TILE, parseInt(node.getAttribute('direction'), 10)) || 0,
    type: parseInt(node.getAttribute('id'), 10) || MapElemType.UNKNOWN,
    elemType: node.tagName,
    radius: parseFloat(node.getAttribute('radius'), 10) || null,
    init: parseInt(node.getAttribute('init'), 10) || null,
    origin: MapElemOrigin.FILE,
  }));
}

export function mapElemsToXml(elems) {
  const tags = elems.map((elem) => {
    const attributes = Object.keys(elem)
      .map((prop) => {
        switch (prop) {
          case 'type':
            return `id="${elem[prop]}" `;
          case 'x':
          case 'y':
            return `${prop}="${elem[prop]}" `;
          case 'dir':
            return `dir="${degCssToXml(elem.elemType, elem[prop])}" `;
          case 'radius':
            return elem[prop] !== null ? `radius="${elem[prop]}" ` : '';
          case 'init':
            return elem[prop] !== null ? `init="${elem[prop]}" ` : '';
          default:
            return '';
        }
      })
      .join('');
    return `<${elem.elemType} ${attributes}/>`;
  }).join('');

  return `
    <?xml version="1.0" encoding="utf-8" standalone="no"?>
    <configuration>${tags}</configuration>
  `;
}
