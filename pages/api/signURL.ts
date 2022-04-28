// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from 'next'

import { compressToBase64 } from 'lz-string';
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'jsonwebtoken';

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    url: compressToBase64(sign({
      security: compressToBase64(`${process.env.NEXT_PUBLIC_GRAPHQL_HOST}?key=${`${uuidv4()}`}`)
    }, process.env.SIGNED_URL_SECRET!,
      {
        expiresIn: '5m'
      }))
  })
}

export default handler