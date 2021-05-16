import { Message } from "discord.js";
import { Command, CommandoMessage } from "discord.js-commando";
import Makibot from "../../Makibot";
import { AutoRoleConfiguration } from "../../lib/autorole";

interface RemoveAutoRoleCommandArguments {
  message: string;
  emoji: string;
}

export default class RemoveAutoRoleCommand extends Command {
  constructor(public client: Makibot) {
    super(client, {
      name: "removeautorole",
      memberName: "removeautorole",
      group: "admin",
      description: "Drop an existing autorole relationship",
      ownerOnly: true,
      guildOnly: false,
      args: [
        { key: "message", type: "string", prompt: "Message snowflake", default: "" },
        { key: "emoji", type: "string", prompt: "Emoji to use", default: "" },
      ],
    });
  }

  async run(
    msg: CommandoMessage,
    args: RemoveAutoRoleCommandArguments
  ): Promise<Message | Message[]> {
    const prevConf: AutoRoleConfiguration[] = this.client.provider.get(
      "global",
      "autorole:config",
      []
    );
    const cleanConf = prevConf.filter(
      (conf) => conf.messageId != args.message || conf.reaction != args.emoji
    );
    return this.client.provider.set("global", "autorole:config", cleanConf).then(() => {
      this.client.manager.restart("autorole");
      return msg.reply("Ajustes guardados correctamente");
    });
  }
}
