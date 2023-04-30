import { ApplicationCommandDataResolvable, ChatInputCommandInteraction, Client, Collection, Events, Interaction, REST, Routes, Snowflake } from 'discord.js';
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "../interfaces/commands";
import { checkPerms, PermissionResult } from '../basics/checkPerms';
import { config } from '../basics/config';
import { i18n } from '../basics/i18n';
import { MPE } from '../basics/MPE';
import { mQueue } from './mQueue';

export class Mango {
	public readonly prefix = config.PREFIX;
	public commands = new Collection<string, Command>();
	public slashCommands = new Array<ApplicationCommandDataResolvable>();
	public slashCommandsMap = new Collection<string, Command>();
	public cooldowns = new Collection<string, Collection<Snowflake, number>>();
	public queues = new Collection<Snowflake, mQueue>();


	public constructor(public readonly client: Client) {
		this.client.login(config.TOKEN);

		this.client.on("ready", () => {
			console.log(`${this.client.user?.username} ready!`);
			this.registerSlashCommands();

			// Set the bot's status
			this.client.user?.setPresence({
				status: 'online', // You can use 'online', 'idle', 'dnd', or 'invisible'
				activities: [
					{
						name: `/help`// The text displayed as the bot's status
					}
				]
			});
		});

		this.client.on("warn", (info) => console.log(info));
		this.client.on("error", console.error);
		this.onInteractionCreate();
	}

	private async registerSlashCommands() {
		const rest = new REST({ version: "9" }).setToken(config.TOKEN);
		const commandFiles = readdirSync(join(__dirname, "..", "commands")).filter((file) => !file.endsWith(".map"));
		for (const file of commandFiles) {
			const command = await import(join(__dirname, "..", "commands", `${file}`));

			this.slashCommands.push(command.default.data);
			this.slashCommandsMap.set(command.default.data.name, command.default);
		}
		await rest.put(Routes.applicationCommands(this.client.user!.id), { body: this.slashCommands });
	}

	private async onInteractionCreate() {
		this.client.on(Events.InteractionCreate, async (interaction: Interaction): Promise<any> => {
			if (!interaction.isChatInputCommand()) return;

			const command = this.slashCommandsMap.get(interaction.commandName);

			if (!command) return;

			if (!this.cooldowns.has(interaction.commandName)) {
				this.cooldowns.set(interaction.commandName, new Collection());
			}

			const now = Date.now();
			const timestamps: any = this.cooldowns.get(interaction.commandName);
			const cooldownAmount = (command.cooldown || 1) * 1000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return interaction.reply({
						content: i18n.__mf("common.cooldownMessage", {
							time: timeLeft.toFixed(1),
							name: interaction.commandName
						}),
						ephemeral: true
					});
				}
			}

			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

			try {
				const permissionsCheck: PermissionResult = await checkPerms(command, interaction);

				if (permissionsCheck.result) {
					command.execute(interaction as ChatInputCommandInteraction);
				} else {
					throw new MPE(permissionsCheck.missing);
				}
			} catch (error: any) {
				console.error(error);

				if (error.message.includes("permissions")) {
					interaction.reply({ content: error.toString(), ephemeral: true }).catch(console.error);
				} else {
					interaction.reply({ content: i18n.__("common.errorCommand"), ephemeral: true }).catch(console.error);
				}
			}
		});
	}
}