import axios from "axios";
import dayjs from "dayjs";
import config from "../config/index.js";

// 天气预报Key
const weather_key = "d8b335623ff04878a9ee96165c88ee26";

// 获取地区ID
const getAddress = async (province, city) => {
  const res = await axios({
    url: "https://geoapi.qweather.com/v2/city/lookup",
    method: "GET",
    params: {
      location: city,
      adm: province,
      key: weather_key,
      range: "cn",
      number: 1,
      lang: "zh",
    },
  });
  if (res.data.code !== "200" || res.data.location.length === 0) {
    throw Error("地区不存在！");
  }
  return res.data.location[0].id;
};

// 获取天气
export const getWeather = async (province, city) => {
  const address_id = await getAddress(province, city);

  const res = await axios({
    url: "https://devapi.qweather.com/v7/weather/3d",
    method: "GET",
    params: {
      location: address_id,
      key: weather_key,
      lang: "zh",
      unit: "m",
    },
  });

  if (res.data.code != "200" || res.data.daily == null) {
    throw Error("获取天气错误！");
  }
  res.data.daily[0].url = res.data.fxLink

  return res.data.daily[0];
};

// 获取每日一言
export const getSentence = async () => {
  const res = await axios({
    url: "http://open.iciba.com/dsapi/",
    method: "GET",
  });
  if (res.status != 200) {
    throw Error("获取每日一言错误！");
  }
  return {
    en: res.data.content,
    zh: res.data.note,
  };
};

// 获取情话
export const getLove = async () => {
  const res = await axios({
    url: "https://api.uomg.com/api/rand.qinghua?format=json",
    method: "GET",
  });
  if (res.status != 200) {
    throw Error("获取情话错误！");
  }
  return res.data.content;
};

// 获取Access_Token
export const getAccessToekn = async () => {
  const res = await axios({
    url: `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.APPID}&secret=${config.APPSECRET}`,
    method: "GET",
  });
  if (res.status != 200) {
    throw Error("获取Access_Token错误！");
  }
  return res.data.access_token;
};

// 推送消息
export const sendTemplate = async (accessToken, user, url, data) => {
  const res = await axios({
    url: `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${accessToken}`,
    method: "POST",
    data: {
      touser: user,
      template_id: config.TEMPLATE_ID,
      url: url,
      topcolor: "#FF0000",
      data: data,
    },
  });
  if (res.status != 200) {
    throw Error("推送模板错误！");
  }
  return res.data;
};

// 获取随机颜色
export const getColor = () => {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padEnd(6, "0")}`;
};

// 获取生日信息
export const getBirthdayMsg = (date) => {
  // 距下次生日天数
  let days = dayjs(
    dayjs().format("YYYY") + "-" + dayjs(date).format("MM-DD")
  ).diff(dayjs(), "day");
  if (days < 0) {
    days = dayjs(
      dayjs().add(1, "year").format("YYYY") + "-" + dayjs(date).format("MM-DD")
    ).diff(dayjs(), "day");
  }

  // 获取年龄
  let age = dayjs().diff(date, "year");
  return {
    diff: days,
    age: age,
  };
};

// 获取恋爱信息
export const getLoveMsg = date => {
    const days = dayjs().diff(dayjs(date), "d");
    if (days < 0) {
        throw Error("你们还没有在一起哦");
    }
    const year = dayjs().diff(dayjs(date), "y") + 1;
    const next = dayjs(dayjs().add(1, "year").format("YYYY") + "-" + dayjs(date).format("MM-DD")).diff(dayjs(), "d");

    return {
        days,
        year,
        next
    }
}
// 获取结婚信息
export const getMarryMsg = date => {
    const days = dayjs().diff(dayjs(date), "d");
    if (days < 0) {
        throw Error("你们还没有结婚哦");
    }
    const year = dayjs().diff(dayjs(date), "y") + 1;
    const next = dayjs(dayjs().add(1, "year").format("YYYY") + "-" + dayjs(date).format("MM-DD")).diff(dayjs(), "d");

    return {
        days,
        year,
        next
    }
}
