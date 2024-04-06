import { NotFoundException } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { CardService } from 'src/card/card.service';
import { FindAllCardsArgs } from 'src/card/dto/find-all-cards.args';
import { Card } from 'src/card/entities/card.entity';
import {
  Fields,
  ParsedField,
} from 'src/utils/graphql/decorators/fields.decorator';
import { ClassService } from './class.service';
import { FindOneClassArgs } from './dto/find-one-class.args';
import { Class } from './entities/class.entity';

@Resolver(() => Card)
export class ClassResolver {
  constructor(
    private readonly cardService: CardService,
    private readonly classService: ClassService,
  ) {}

  @Query(() => Class, { name: 'class' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @Fields() attributes: ParsedField,
  ) {
    const args = new FindOneClassArgs();
    if (!attributes.fields.length) {
      attributes.fields.push('id');
    }
    args.attributes = attributes;
    args.id = id;
    const clax = await this.classService.findOne(args);
    if (!clax) {
      throw new NotFoundException(id);
    }

    if (attributes.relations['cards']) {
      const args = new FindAllCardsArgs();
      // TODO: remove hardcoded neutral id
      args.classes = [id, 6];
      args.attributes = attributes.relations['cards'];
      clax.cards = await this.cardService.findAll(args);
    }
    return clax;
  }
}
