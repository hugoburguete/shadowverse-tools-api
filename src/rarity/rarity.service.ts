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
  async findAll({ attributes: attrs }: FindAllRaritiesArgs): Promise<Rarity[]> {
    return await this.expansionModel.findAll({
      limit: 25,
      attributes: attrs.fields,
    });
  }
}
