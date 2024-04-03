import { type Hero, HeroRole, HeroElement } from "@prisma/client";
import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";

import HeroModel from "./HeroModel";
import HeroService from "./HeroService";

import { capitalize } from "@utils/string";
import colors from "@utils/colors";
import CommonResponse from "@features/common/CommonResponse";

export type HeroByRole = {
  [Role in HeroRole]: { name: string; element: HeroElement }[];
};

export default class HeroResponse<T extends ChatInputCommandInteraction> {
  private _options: T["options"];
  private _hero: Hero | Hero[] | null = null;

  constructor(interact: T) {
    this._options = interact.options;
  }

  get options() {
    return this._options;
  }

  get hero() {
    return this._hero;
  }

  async getResponse() {
    const { category: isByCategory, name: isByName } =
      this._getAllOptionsValue();

    if (isByCategory && isByName) {
      // prettier-ignore
      const response = CommonResponse
        .buildErrorResponse()
        .setDescription("Name and Category are exclusive, please use one of them");

      return response;
    }

    const response = new EmbedBuilder();

    response.setTitle("Heroes").setColor(colors.sky);

    await this._fetchHeroes();

    isByName
      ? this._buildEmbedResponseHeroByName(response)
      : isByCategory
        ? this._buildEmbedResponseHeroByCategory(response, isByCategory)
        : this._buildEmbedResponseAllHeroes(response);

    return response;
  }

  /**
   * build embed response if there's no parameter
   * or options passed by user
   *
   * returning all of heroes.
   *
   * @param builder
   *
   * @returns
   */
  private _buildEmbedResponseAllHeroes(builder: EmbedBuilder) {
    HeroService.assertHeroIsArray(this.hero);

    const content = HeroService.generateContentGrouped(this.hero);

    content.forEach((value) => builder.addFields({ ...value }));

    return builder;
  }

  /**
   * build embed response if hero filtered by name
   * or we can say, build embed response for
   * hero details.
   *
   * @param builder
   *
   * @returns
   */
  private _buildEmbedResponseHeroByName(builder: EmbedBuilder) {
    const hero = this.hero;

    if (hero == null) {
      // prettier-ignore
      builder = CommonResponse
          .buildErrorResponse()
          .setDescription("Hero not found.");

      return builder;
    }
    if (Array.isArray(hero)) {
      // prettier-ignore
      builder = CommonResponse
        .buildErrorResponse()
        .setDescription("Invalid return value, expected to be a single value but returned array. Please contact developer :)");

      return builder;
    }

    builder.setTitle("Hero Details");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, createdAt, updatedAt, ...attribute } = hero;

    const fields = HeroService.generateContentDetailed(attribute);

    fields.forEach((field) => builder.addFields({ ...field }));

    return builder;
  }

  /**
   * build embed response if heroes filtered or selected by `category`
   * like `Support`, `Healer` and so on.
   *
   * @param builder
   * @param category
   *
   * @returns
   */
  private _buildEmbedResponseHeroByCategory(
    builder: EmbedBuilder,
    category: string
  ) {
    category = category.replace("_", " ");

    builder.setTitle("Heroes by Category");

    if (!Array.isArray(this.hero)) {
      // prettier-ignore
      builder = CommonResponse
        .buildErrorResponse()
        .setDescription("There's no hero in this category");

      return builder;
    }

    const heroes = HeroService.generateContentFromRole(this.hero);

    builder.addFields({
      name: category,
      value: heroes,
    });

    return builder;
  }

  /**
   * function used to get options sent by user,
   * returning options values.
   *
   * @returns
   */
  private _getAllOptionsValue() {
    const name = this.options.getString("name");
    const category = this.options.getString("category");

    const fmtName = name ? capitalize(name) : null;

    return { name: fmtName, category };
  }

  /**
   * function to get heroes based on option
   * sent by user
   *
   * @returns
   */
  private async _fetchHeroes() {
    const { name, category } = {
      ...this._getAllOptionsValue(),
    };

    const heroModel = new HeroModel();

    const isByCategory = category && HeroService.isHeroRole(category);

    try {
      this._hero = name
        ? await heroModel.getHeroByName(name)
        : isByCategory
          ? await heroModel.getHeroByCategory(category)
          : await heroModel.getAllHeroes();

      return this;
    } catch (err) {
      throw err;
    }
  }
}
