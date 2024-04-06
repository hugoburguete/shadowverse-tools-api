import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindAllRaritiesArgs } from './dto/find-all-rarities.args';
import { Rarity } from './entities/rarity.entity';

@Injectable()
export class RarityService {
  constructor(
    @InjectModel(Rarity)
    private readonly expansionModel: typeof Rarity,
  ) {}
  async findAll({
    attributes: attrs,
    skip,
    take,
  }: FindAllRaritiesArgs): Promise<Rarity[]> {
    return await this.expansionModel.findAll({
      offset: skip,
      limit: take,
      attributes: attrs.fields,
    });
  }
}
