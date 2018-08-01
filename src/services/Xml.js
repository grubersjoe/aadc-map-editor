import shortid from 'shortid';
import { DEBUG } from '../config';
import { MapElemOrigin, MapElemType } from '../components/MapElem';

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
  if (!Array.isArray(tagNames) || !tagNames.length) {
    throw new Error('Invalid `tagNames` parameter');
  }

  const xmlDoc = parseXml(xmlString);
  const nodes = [...xmlDoc.querySelectorAll(tagNames.join())];

  if (!nodes.length) {
    throw new Error('No valid XML nodes found.');
  }

  return nodes.map(node => ({
    key: shortid.generate(),
    x: parseFloat(node.getAttribute('x')),
    y: parseFloat(node.getAttribute('y')),
    dir: parseInt(node.getAttribute('dir'), 10) || 0,
    type: parseInt(node.getAttribute('id'), 10) || MapElemType.UNKNOWN,
    elemType: node.tagName,
    radius: parseFloat(node.getAttribute('radius'), 10) || null,
    init: parseInt(node.getAttribute('init'), 10) || null,
    origin: MapElemOrigin.FILE,
  }));
}

export function loadXmlFile(files) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(files[0]);

    reader.onload = (ev) => {
      const elemTypes = [
        XmlTags.TILE,
        XmlTags.ROAD_SIGN,
        XmlTags.PEDESTRIAN_CROSSING,
        // XmlTags.PARKING_SPACE,
      ];

      try {
        const nodes = parseXmlTags(ev.target.result, elemTypes);
        resolve(nodes);
      } catch (err) {
        if (DEBUG) {
          console.error(DEBUG);
        }
        reject(err);
      }
    };

    reader.onerror = reject;
  });
}

export async function parseXmlTagsFromUrl(url, tagNames = []) {
  return fetch(url)
    .then(res => res.text())
    .then(xmlString => parseXmlTags(xmlString, tagNames))
    .catch((err) => {
      if (DEBUG) {
        console.error('Unable to parse XML from URL: ', url, err);
      }
    });
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
            return `${prop}="${elem[prop].toFixed(1)}" `;
          case 'dir':
            return `dir="${elem[prop]}" `;
          case 'radius':
            return elem[prop] !== null ? `radius="${elem[prop].toFixed(1)}" ` : '';
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
