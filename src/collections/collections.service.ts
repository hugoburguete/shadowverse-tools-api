import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Includeable, Op } from 'sequelize';
import { Card } from 'src/card/entities/card.entity';
import { Class } from 'src/class/entities/class.entity';
import { ParsedField } from 'src/common/decorators/fields.decorator';
import { Rarity } from 'src/rarity/entities/rarity.entity';
import { CreateOrUpdateCollectionInput } from './dto/create-or-update-collection.input';
import { FindOneCollectionArgs } from './dto/find-one-collection.args';
import { CollectionCard } from './entities/collection-card.entity';
import { Collection } from './entities/collection.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection)
    private collectionModel: typeof Collection,
    @InjectModel(CollectionCard)
    private collectionCardModel: typeof CollectionCard,
  ) {}

  async createOrUpdate(
    createCollectionInput: CreateOrUpdateCollectionInput,
    attributes: ParsedField,
  ): Promise<Collection> {
    let collection = await this.collectionModel.findOne({
      where: { userId: { [Op.eq]: createCollectionInput.userId } },
    });

    const { cardsToAdd, cardsToRemove, ...rest } = createCollectionInput;
    if (!collection) {
      collection = await this.collectionModel.create(rest);
    }

    // Add cards
    if (cardsToAdd && cardsToAdd.length) {
      const bulkCreateCollectionCardsPayload = cardsToAdd.map((card) => {
        card.collectionId = collection.id;
        return { ...card };
      });
      await this.collectionCardModel.bulkCreate(
        bulkCreateCollectionCardsPayload,
      );
    }

    // Remove cards
    if (cardsToRemove && cardsToRemove.length) {
      await this.collectionCardModel.destroy({
        where: {
          collectionId: { [Op.eq]: collection.id },
          cardId: { [Op.in]: cardsToRemove.map((card) => card.cardId) },
        },
      });
    }

    return await this.findOne({
      userId: createCollectionInput.userId,
      attributes,
    });
  }

  async findOne({
    userId,
    attributes,
  }: FindOneCollectionArgs): Promise<Collection> {
    const include: Includeable[] = this.getAssociations(attributes);

    let collection = await this.collectionModel.findOne({
      where: { userId: { [Op.eq]: userId } },
      attributes: attributes.fields,
      include,
    });

    if (!collection) {
      collection = {
        cards: [],
      } as Collection;
    }

    return collection;
  }

  private getAssociations(attributes: ParsedField): Includeable[] {
    const include = [];
    const cardsAttr = attributes.relations.cards;
    if (cardsAttr) {
      include.push(this.getCardsAssociation(cardsAttr));
    }

    return include;
  }

  private getCardsAssociation(cardsAttr: ParsedField<string>): Includeable {
    const include = [];
    const classAttr = cardsAttr.relations.class;
    if (classAttr) {
      include.push(this.getClassAssociation(classAttr));
    }

    const rarityAttr = cardsAttr.relations.rarity;
    if (rarityAttr) {
      include.push(this.getRarityAssociation(rarityAttr));
    }

    return {
      model: Card,
      attributes: cardsAttr.fields,
      include,
    };
  }

  private getClassAssociation(classAttr: ParsedField<string>): Includeable {
    return {
      model: Class,
      attributes: classAttr.fields,
    };
  }

  private getRarityAssociation(classAttr: ParsedField<string>): Includeable {
    return {
      model: Rarity,
      attributes: classAttr.fields,
    };
  }
}
