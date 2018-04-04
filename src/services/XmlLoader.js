import { MapElemOrigin, MapElemType } from '../components/MapElem';
import { degXmlToCss } from '../util/style';

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
    init: parseInt(node.getAttribute('init'), 10) || 0,
    origin: MapElemOrigin.FILE,
  }));
}
