import * as yargs from "yargs";
import Client from "./lib/http/client";

const client = new Client();

const clankctl = yargs;

clankctl.command(
  "healthcheck",
  "check the status of the bot",
  () => ({}),
  () => {
    client
      .healthcheck()
      .then((outcome) => {
        if (outcome) {
          console.log("The bot is alive");
          process.exit(0);
        } else {
          console.log("The bot is not healthy");
          process.exit(1);
        }
      })
      .catch((e) => {
        console.error(e);
        process.exit(1);
      });
  }
);

clankctl.command(
  "guilds",
  "list all the guilds the bot is in",
  () => ({}),
  async () => {
    const guilds = await client.guilds();
    guilds.forEach((guild) => console.log(`${guild.id} | ${guild.name}`));
    process.exit(0);
  }
);

clankctl.command(
  "get-config <guild>",
  "get the config for a guild",
  () => ({}),
  async (argv: { guild: string }) => {
    client
      .guildSettings(argv.guild)
      .then((settings) => {
        console.log(settings);
        process.exit(0);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        process.exit(1);
      });
  }
);

clankctl.command(
  "antiraid [mode]",
  "enable or disable the antiraid mode",
  () => ({}),
  async (argv: { mode?: string }) => {
    if (argv.mode) {
      switch (argv.mode) {
        case "on":
          await client.setRaidMode(true);
          console.log("Antiraid mode has been enabled");
          process.exit(0);
          break;
        case "off":
          await client.setRaidMode(false);
          console.log("Antiraid mode has been disabled");
          process.exit(0);
          break;
        default:
          console.error("Keyword not understood: " + argv.mode);
          process.exit(1);
          break;
      }
    } else {
      const status = await client.raidModeStatus();
      console.log(`Antiraid mode ${status ? "is enabled" : "is disabled"}`);
      process.exit(0);
    }
  }
);

clankctl.command(
  "set-config <guild> <key> <value>",
  "update the configuration for a specific guild",
  () => ({}),
  async (argv: { guild: string; key: string; value: string }) => {
    client
      .setSetting(argv.guild, argv.key, argv.value)
      .then(() => {
        process.exit(0);
      })
      .catch((err) => {
        console.error(`Error: ${err}`);
        process.exit(1);
      });
  }
);

clankctl.help().argv;
