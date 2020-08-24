import axios from 'axios';
import logger from './logger';

const BOT_API = process.env.BOT_API;
const API_TOKEN = process.env.BOT_API_TOKEN;

export const sendMessage = (id: string, text: string, parseMode: 'HTML' | 'Markdown' = undefined) => {
  axios.get(`${BOT_API}/sendMessage`, {
    params: {
      id,
      text,
      parse_mode: parseMode,
    },
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  }).catch((e) => logger.error('Failed to send Telegram message', { id, text, error: e.toString() }));
};
