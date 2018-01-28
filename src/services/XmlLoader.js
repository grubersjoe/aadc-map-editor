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
    type: node.tagName,
    id: parseInt(node.getAttribute('id'), 10),
    x: parseFloat(node.getAttribute('x')),
    y: parseFloat(node.getAttribute('y')),
    direction: parseInt(node.getAttribute('direction'), 10),
  }));
}

export async function parseXmlFromUrl(url, tagNames) {
  return fetch(url)
    .then(res => res.text())
    .then(xmlString => parseXmlTags(xmlString, tagNames));
}

