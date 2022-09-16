import { OptionsType } from 'cookies-next/src/types';

const options: OptionsType = {
  domain: process.env.NODE_ENV === 'production'
    ? String(process.env.NEXT_PUBLIC_WEBAPP_URI)
      .replace(/([http|https]+:\/\/)/g, '')
      .replace(/([:?+\d]+\/)/g, '')
    : 'localhost',
  secure: process.env.NODE_ENV === 'production',
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
  maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year
} as const;

export default options;
