import dayjs from "dayjs";
import config from "./config/index.js";
import {
  getWeather,
  getSentence,
  getLove,
  getAccessToekn,
  sendTemplate,
  getColor,
  getBirthdayMsg,
  getLoveMsg,
  getMarryMsg
} from "./utils/index.js";
const main = async () => {
  // 获取每日一言
  const sentence = await getSentence();

  const access_token = await getAccessToekn();
  const week = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  config.USERS.forEach(async (user) => {
    // 获取天气信息
    const weather = await getWeather(user.province, user.city);
    // 获取恋爱信息
    const love = await getLoveMsg(user.love_date);
    console.log(love);

    // 生日信息
    const birthday = await getBirthdayMsg(user.birthday_date);

    // 获取结婚信息
    const marry = await getMarryMsg(user.marry_date);

    // 获取情话
    const loveSentence = await getLove();
    
    const res = sendTemplate(access_token, user.user_id, weather.url, {
      // 今日日期
      date: {
        value: `${dayjs().format("YYYY-MM-DD")} ${week[dayjs().format("d")]}`,
        color: getColor(),
      },
      // 地区
      address: {
        value: `${user.province} ${user.city}`,
        color: getColor()
      },
      // 今日天气
      weather: {
        value: weather.textDay,
        color: getColor()
      },
      // 今日最高气温
      max_temp: {
        value: `${weather.tempMax}℃`,
        color: getColor()
      },
      // 今日最低气温
      min_temp: {
        value: `${weather.tempMin}℃`,
        color: getColor()
      },
      // 今日风力等级
      level: {
        value: weather.windScaleDay,
        color: getColor()
      },
      // 今日风向
      wind: {
        value: weather.windDirDay,
        color: getColor()
      },
      // 恋爱天数
      love_date: {
        value: love.days,
        color: getColor()
      },
      // 恋爱周年
      love_year: {
        value: love.year,
        color: getColor()
      },
      // 下一个恋爱纪念日
      love_day: {
        value: love.next,
        color: getColor()
      },
      // 结婚天数
      marry_date: {
        value: marry.days,
        color: getColor()
      },
      // 结婚周年
      marry_year: {
        value: marry.year,
        color: getColor()
      },
      // 下一个结婚纪念日
      marry_day: {
        value: marry.next,
        color: getColor()
      },
      // 生日
      birthday: {
        value: `🎂距离${user.name}的${birthday.age}周岁生日还有${birthday.diff}天`,
        color: getColor()
      },
      // 情话
      love: {
        value: loveSentence,
        color: getColor()
      },
      // 每日一言
      sentence_en: {
        value: sentence.en + "\n",
        color: getColor()
      },
      sentence_zh: {
        value: sentence.zh,
        color: getColor()
      }
    });

    console.log(`${user.name}推送成功`);
  });
};

main();