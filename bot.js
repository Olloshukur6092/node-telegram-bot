require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;

const bot = new TelegramBot(BOT_TOKEN, { polling: false });
bot.setWebHook('https://node-telegram-bot-eta.vercel.app/api/telegram');

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  bot.sendMessage(
    chatId,
    `Assalomu alaykum ${msg.chat.first_name}! \n\nValyuta bilish uchun bosing!`,
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Hozirgi kurslarni bilish", callback_data: "get_valyuta" }],
        ],
      },
    }
  );
});


bot.on("callback_query", async (callbackQuery) => {
  let messageText = "";
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === "get_valyuta") {
    bot.answerCallbackQuery(callbackQuery.id);
    try {
      const res = await axios.get(
        "https://cbu.uz/uz/arkhiv-kursov-valyut/json/"
      );

      for (let i = 0; i < 3; i++) {
        // console.log(res.data[i]);
        messageText +=
          `1 ${res.data[i].CcyNm_UZ} ${parseInt(res.data[i].Rate)} so'm` +
          "\n \n";
      }
      bot.sendMessage(chatId, messageText);
    } catch (err) {
      console.log(err);
      bot.sendMessage(chatId, "Ooo Error!");
    }
  }
});

