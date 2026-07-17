import { getMapJSON } from 'dotted-map';
import fs from 'fs';

const json = getMapJSON({ height: 35, countries: ['PRT'], grid: 'diagonal' });
fs.writeFileSync('./src/data/portugalMapGrid.json', json);
console.log('wrote', json.length, 'bytes');
