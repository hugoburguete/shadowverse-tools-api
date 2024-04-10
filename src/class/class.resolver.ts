import { NotFoundException } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { CardService } from 'src/card/card.service';
import { FindAllCardsArgs } from 'src/card/dto/find-all-cards.args';
import { Card } from 'src/card/entities/card.entity';
import { Fields, ParsedField } from 'src/common/decorators/fields.decorator';
import { ClassService } from './class.service';
import { FindAllClassesArgs } from './dto/find-all-classes.args';
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
    return await this.addRelations(id, clax, attributes);
  }

  @Query(() => [Class], { name: 'classes' })
  async findAll(@Fields() attributes: ParsedField) {
    const args = new FindAllClassesArgs();
    attributes.fields.push('id');
    args.attributes = attributes;
    const classes = await this.classService.findAll(args);

    for (let idx = 0; idx < classes.length; idx++) {
      const clax = classes[idx];
      classes[idx] = await this.addRelations(clax.id, clax, attributes);
    }
    return classes;
  }

  private addRelations = async (
    classId: number,
    clax: Class,
    attributes: ParsedField,
  ): Promise<Class> => {
    const cardsRelation = attributes.relations['cards'];
    if (cardsRelation) {
      const args = new FindAllCardsArgs();
      // TODO: remove hardcoded neutral id
      args.classes = [classId, 6];
      args.attributes = cardsRelation;
      clax.cards = await this.cardService.findAll(args);
    }
    return Promise.resolve(clax);
  };
}
