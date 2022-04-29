// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'

import {
  SheetCSV,
  LayoutAssignAlelo,
  layoutAssignAleloColumnNames
} from '@/src/utils/SheetEx'

import stream from 'stream';
import { promisify } from 'util';
import { v4 } from 'uuid';

import fs from 'fs'
import path from 'path'

const pipeline = promisify(stream.pipeline);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const
    {
      filename,
      rows
    } = req.query,
    rowsParser = JSON.parse(rows as string),
    buffer = Buffer.from(await SheetCSV<LayoutAssignAlelo>(rowsParser, {
      sheetName: `Cartões para Associar`,
      worksheetName: 'Associação',
      columnNames: layoutAssignAleloColumnNames,
    }), 'utf8'),
    filePath = path.resolve('.', `temp/${v4()}.csv`),
    readStream = fs.createReadStream(filePath);

  fs.writeFileSync(filePath, buffer);

  res.setHeader('Content-Type', 'application/csv');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}.csv`);

  res.on('close', () => fs.unlinkSync(filePath));

  await pipeline(readStream, res);
};

export default handler;