import { getMapJSON } from 'dotted-map';
import fs from 'fs';

const json = getMapJSON({ height: 50, grid: 'diagonal' });
fs.writeFileSync('./src/data/worldMapGrid.json', json);
console.log('wrote', json.length, 'bytes');
