"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStartButton = void 0;
const telegraf_1 = require("telegraf");
const createStartButton = () => {
    // Создаем клавиатуру с одной кнопкой
    return telegraf_1.Markup.keyboard([telegraf_1.Markup.button.callback('Start', 'start')]);
};
exports.createStartButton = createStartButton;
