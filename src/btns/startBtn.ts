import {Markup} from 'telegraf';

export const createStartButton = () => {
  // Создаем клавиатуру с одной кнопкой
  return Markup.keyboard([Markup.button.callback('Start', 'start')]);
};
