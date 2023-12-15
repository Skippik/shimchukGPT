import {Context, NarrowedContext, Telegraf} from 'telegraf';
import {message} from 'telegraf/filters';
import dotenv from 'dotenv';
import {createStartButton} from './btns/startBtn';
import {Update} from 'telegraf/typings/core/types/typegram';
const fs = require('fs');
const path = require('path');
const absoluteFilePath = path.join(__dirname, './badWords.json');

//
const data = fs.readFileSync(absoluteFilePath, 'utf8');
const badWords = Object.values(JSON.parse(data)) as string[];

//

dotenv.config();

const botToken = process.env.BOT_TOKEN as string;

const bot = new Telegraf(botToken);

// Обработчик для приветственного сообщения
bot.start(ctx => {
  const keyboard = createStartButton().resize();

  ctx.reply('Привет! Я ваш бот!!!!.', keyboard);
});

//
const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// Обработчик события для кнопки
bot.on(message('text'), async ctx => {
  try {
    const messageId = ctx.message.message_id;
    const chatId = ctx.message.chat.id;
    const senderUsername =
      ctx.message.from.username || 'нет_имени_пользователя';

    if (ctx.message && ctx.message.text) {
      const originalText = ctx.message.text;

      // Экранирование специальных символов в запрещенных словах
      const escapedBadWords = badWords.map(str => escapeRegExp(str));

      // Проверка на наличие запрещенных слов и их замена на "Hi"
      const filteredText = originalText.replace(
        new RegExp(escapedBadWords.join('|'), 'gi'),
        'Hi',
      );

      // Вывод в консоль оригинального и отфильтрованного текста
      console.log('Оригинальный текст:', originalText);
      console.log('Отфильтрованный текст:', filteredText);

      // Отправка отфильтрованного текста в канал
      if (originalText !== filteredText) {
        ctx.reply(
          `Пользователь ${senderUsername}: Отправил нехорошее слово в сообщении: ||${originalText}|| Поэтому я ShimchukGPT заменил его котиком 😻❤️ Всем добра\\! Не делай так больше ${senderUsername}`,
          {
            parse_mode: 'MarkdownV2',
          },
        );
        await new Promise(r => setTimeout(r, 3000));

        try {
          await ctx.telegram.deleteMessage(chatId, messageId);
        } catch (error) {
          console.error('Ошибка при удалении сообщения:', error);
        }
      }
    }
  } catch (error) {
    console.error('Ошибка в обработчике текстового сообщения:', error);
  }
});

// Запустите бот
try {
  bot.launch();
} catch (error) {
  console.error('Ошибка при запуске бота:', error);
}
