import { degCssToXml } from '../util/style';

export default function mapElemsToXml(elems) {
  const tags = elems.map((elem) => {
    const attributes = Object.keys(elem)
      .map((prop) => {
        switch (prop) {
          case 'x':
          case 'y':
            return `${prop}="${elem[prop]}" `;
          case 'type':
            return `id="${elem[prop]}" `;
          case 'dir':
            return `dir="${degCssToXml(elem.elemType, elem[prop])}" `;
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
