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
const dotenv_1 = __importDefault(require("dotenv"));
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
//
//
const FORM_LINK = 'https://docs.google.com/spreadsheets/d/1xdCWrb6opUb7s5_542I5kxUEmNKI7r-WdIlOonO3v5M/edit?usp=sharing';
// Обработчик для приветственного сообщения
bot.start(ctx => {
    // const keyboard = createStartButton().resize();
    ctx.reply('Всем привет. 👋');
});
bot.on('new_chat_members', ctx => {
    ctx.message.new_chat_members.forEach(newMember => {
        const firstName = newMember.first_name || 'Новый участник';
        const welcomeMessage = `Привет, ${firstName}! 👋\n\nМы тут собираемся на вечер встречи выпускников 2025 года, который состоится 1 февраля. Мы рады тебя видеть! 😊\n\nСейчас мы находимся в поисках всех людей из нашего выпуска. Если не трудно, перейди по ссылке и впиши имена тех, с кем ты учился, но их пока нет в общем списке: ${FORM_LINK}\n\nСпасибо! 🙌`;
        // Отправляем сообщение в чат
        ctx.reply(welcomeMessage);
    });
});
//
const fetchAllMembers = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chatId = ctx.chat.id; // ID группы
        const members = []; // Массив для хранения данных участников
        // Внимание! Это пример для группы с известными ID участников
        // В реальных сценариях Telegram API не позволяет получить полный список участников без доп. методов
        const chatAdmins = yield bot.telegram.getChatAdministrators(chatId);
        const adminUserIds = chatAdmins.map(admin => admin.user.id);
        // Перебираем ID администраторов (пример)
        for (const userId of adminUserIds) {
            const memberInfo = yield bot.telegram.getChatMember(chatId, userId);
            members.push({
                id: memberInfo.user.id,
                first_name: memberInfo.user.first_name,
                last_name: memberInfo.user.last_name || null,
                username: memberInfo.user.username || null,
                status: memberInfo.status,
            });
        }
        // Сохранение данных в файл
        fs.writeFileSync('group_members.json', JSON.stringify(members, null, 2));
        console.log('Данные участников успешно сохранены!');
        // Сообщение в группу
        ctx.reply(`Собрано данных: ${members.length} участников. Сохранено в "group_members.json".`);
    }
    catch (error) {
        console.error('Ошибка при сборе данных участников:', error);
        ctx.reply('Не удалось собрать данные участников.');
    }
});
// Запустите бот
try {
    bot.launch();
}
catch (error) {
    console.error('Ошибка при запуске бота:', error);
}
