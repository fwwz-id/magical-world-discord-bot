import BaseCommand from "@base/BaseCommand";
import UserModel from "@features/user/UserModel";
import UserResponse from "@features/user/UserResponse";
import {
  type CacheType,
  type ChatInputCommandInteraction,
  type CollectorFilter,
  SlashCommandBuilder,
  DiscordjsError,
  DiscordjsErrorCodes,
} from "discord.js";

class DeleteAccountCommand extends BaseCommand {
  data(): Partial<SlashCommandBuilder> {
    return new SlashCommandBuilder()
      .setName("delete-account")
      .setDescription("delete all past journey.");
  }

  async interact(
    interaction: ChatInputCommandInteraction<CacheType>
  ): Promise<void> {
    const user = interaction.user;
    const { embed, action } =
      await UserResponse.getDeleteAccountConfirmationResponse(user.id);
    const userModel = new UserModel();

    const shouldDelete = !action ? false : true;

    const deleteUserResponse = async () => {
      const deletedUser = await userModel.delete({ discordId: user.id });
      if (deletedUser) {
        await interaction.editReply({
          embeds: [UserResponse.getDeleteAccountDeletedResponse()],
          components: [],
        });
      }
    };

    const response = await interaction.reply({
      ephemeral: true,
      embeds: [embed],
      components: action ? [action] : undefined,
    });

    const collectorFilter = (
      _interaction: ChatInputCommandInteraction<CacheType>
    ) => _interaction.user.id == user.id;

    try {
      const confirmation = await response.awaitMessageComponent({
        filter: collectorFilter as CollectorFilter<unknown[]>,
        time: 1000 * 60,
      });

      if (confirmation.customId == "confirm") {
        await deleteUserResponse();
      }

      if (confirmation.customId == "cancel") {
        await interaction.editReply({
          embeds: [UserResponse.getDeleteAccountCanceledResponse()],
          components: [],
        });
      }
    } catch (err) {
      if (err instanceof DiscordjsError) {
        if (
          err.code == DiscordjsErrorCodes.InteractionCollectorError &&
          shouldDelete
        ) {
          await deleteUserResponse();
        }
      }
    }
  }
}

export default new DeleteAccountCommand();
