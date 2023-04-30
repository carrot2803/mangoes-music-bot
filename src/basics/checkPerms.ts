import { ChatInputCommandInteraction, PermissionResolvable } from "discord.js";
import { Command } from "../interfaces/commands";

export interface PermissionResult {
    result: boolean;
    missing: string[];
}

export async function checkPerms (commands:Command, interaction: ChatInputCommandInteraction): Promise<PermissionResult>  {
    const member = await interaction.guild!.members.fetch({ user: interaction.client.user!.id });
    const requiredPermissions = commands.permissions as PermissionResolvable[];

    if(!commands.permissions) return { result: true, missing: []};
    const missing = member.permissions.missing(requiredPermissions);
    return { result: !Boolean(missing.length), missing};   
}