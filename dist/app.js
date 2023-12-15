"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const filters_1 = require("telegraf/filters");
const dotenv_1 = __importDefault(require("dotenv"));
const startBtn_1 = require("./btns/startBtn");
const fs = require('fs');
const path = require('path');
const absoluteFilePath = path.join(__dirname, './badWords.json');
//
const data = fs.readFileSync(absoluteFilePath, 'utf8');
const badWords = Object.values(JSON.parse(data));
//
dotenv_1.default.config();
const botToken = process.env.BOT_TOKEN;
const bot = new telegraf_1.Telegraf(botToken);
// Обработчик для приветственного сообщения
bot.start(ctx => {
    const keyboard = (0, startBtn_1.createStartButton)().resize();
    ctx.reply('Привет! Я ваш бот!!!!.', keyboard);
});
//
const escapeRegExp = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
// Обработчик события для кнопки
bot.on((0, filters_1.message)('text'), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messageId = ctx.message.message_id;
        const chatId = ctx.message.chat.id;
        const senderUsername = ctx.message.from.username || 'нет_имени_пользователя';
        if (ctx.message && ctx.message.text) {
            const originalText = ctx.message.text;
            // Экранирование специальных символов в запрещенных словах
            const escapedBadWords = badWords.map(str => escapeRegExp(str));
            // Проверка на наличие запрещенных слов и их замена на "Hi"
            const filteredText = originalText.replace(new RegExp(escapedBadWords.join('|'), 'gi'), 'Hi');
            // Вывод в консоль оригинального и отфильтрованного текста
            console.log('Оригинальный текст:', originalText);
            console.log('Отфильтрованный текст:', filteredText);
            // Отправка отфильтрованного текста в канал
            if (originalText !== filteredText) {
                ctx.reply(`Пользователь ${senderUsername}: Отправил нехорошее слово в сообщении: ||${originalText}|| Поэтому я ShimchukGPT заменил его котиком 😻❤️ Всем добра\\! Не делай так больше ${senderUsername}`, {
                    parse_mode: 'MarkdownV2',
                });
                yield new Promise(r => setTimeout(r, 3000));
                try {
                    yield ctx.telegram.deleteMessage(chatId, messageId);
                }
                catch (error) {
                    console.error('Ошибка при удалении сообщения:', error);
                }
            }
        }
    }
    catch (error) {
        console.error('Ошибка в обработчике текстового сообщения:', error);
    }
}));
// Запустите бот
try {
    bot.launch();
}
catch (error) {
    console.error('Ошибка при запуске бота:', error);
}
