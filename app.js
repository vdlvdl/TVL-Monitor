// ---------------------------------------- Specification ---------------------------------------------
const fetch = require("node-fetch");
const Discord = require("discord.js");
require("dotenv").config();

const channelId = process.env.CHANNEL_ID;
const DISCORD = process.env.DISCORD_BOT;
const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });
const all_protocol_tvl_api = "https://api.llama.fi/protocols"; // DefiLama API, all protocol
let channel;
const benchmark = 5000000; // TVL benchmark
// ------------------------------------------ Init -----------------------------------------------
async function init() {
  await client.login(DISCORD);
  channel = await client.channels.fetch(channelId);
}
// ------------------------------------------ Get Data -----------------------------------------------
async function fetch_data() {
  const array_daily = [];
  try {
    const response = await fetch(all_protocol_tvl_api);
    const data = await response.json();
    //console.log(data);
    for (num = 0; num < data.length - 1; num++) {
      if (data[num].change_1d == null) {
        x = "N/A";
      } else {
        x = data[num].change_1d.toPrecision(5);
      }
      array_daily.push({
        Name: data[num].symbol,
        Chain: data[num].chains,
        Link: data[num].url,
        TVL: data[num].tvl,
        Daily_Change: x,
        Weekly_Change: data[num].change_7d,
      });
    }
    return [
      array_daily
        .sort(function (a, b) {
          return b.Weekly_Change - a.Weekly_Change;
        })
        .filter(function (value) {
          return value.TVL >= benchmark;
        }),
    ];
  } catch (e) {
    console.log(e);
  }
}
// --------------------------------------- Displayment ----------------------------------------------
function displayment(array) {
  channel.send(
    "============ Top 5 TVL surge of protocol in past 7 days ==========="
  );
  msg = "```";
  msg =
    msg +
    `\n${"Name".padEnd(6)} | ${"TVL".padEnd(9)} | ${"Daily Δ".padEnd(
      9
    )} | ${"Weekly Δ".padEnd(9)} | ${"Link".padEnd(35)} | ${"Chain".padEnd(
      8
    )} `;
  for (num = 0; num < 5; num++) {
    msg =
      msg +
      `\n${array[0][num]["Name"].padEnd(6)} | ${array[0][num]["TVL"]
        .toPrecision(5)
        .padEnd(8)} | ${array[0][num]["Daily_Change"].padEnd(8)}% | ${array[0][
        num
      ]["Weekly_Change"]
        .toPrecision(3)
        .padEnd(8)}% | ${array[0][num]["Link"].padEnd(35)} | ${
        array[0][num]["Chain"]
      } \n `;
  }
  msg = msg + "\n```";
  console.log(msg);
  channel.send(msg);
}
// --------------------------------------- Main ----------------------------------------------
async function main() {
  await init();
  const defilama_info_array = await fetch_data();
  displayment(defilama_info_array);
  setTimeout(main, 1000 * 60 * 60); // Update hourly
}
main();
