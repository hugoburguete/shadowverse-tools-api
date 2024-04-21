import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/currentuser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EdgesFields } from 'src/common/decorators/edges-fields.decorator';
import { Fields, ParsedField } from 'src/common/decorators/fields.decorator';
import {
  REMOVE_STATUS_ERROR,
  REMOVE_STATUS_SUCCESS,
  RemoveOutput,
} from 'src/user/dto/remove.output';
import {
  UPDATE_STATUS_ERROR,
  UPDATE_STATUS_SUCCESS,
  UpdateOutput,
} from 'src/user/dto/update.output';
import { User } from 'src/user/entities/user.entity';
import { DeckService } from './deck.service';
import { CreateDeckInput } from './dto/create-deck.input';
import { FindAllDecksInput } from './dto/find-all-decks.input';
import { UpdateDeckInput } from './dto/update-deck.input';
import { Deck } from './entities/deck.entity';
import { PaginatedDecks } from './entities/paginated-deck.entity';

@Resolver(() => Deck)
export class DeckResolver {
  constructor(private readonly deckService: DeckService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Deck, {
    description: 'Creates a deck for the logged in user.',
  })
  async createDeck(
    @Args('createDeckInput') createDeckInput: CreateDeckInput,
    @Fields() attributes: ParsedField,
    @CurrentUser() user: Partial<User>,
  ): Promise<Deck> {
    createDeckInput.userId = user.id;
    return await this.deckService.create(createDeckInput, attributes);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => PaginatedDecks, {
    name: 'decks',
    description: 'Finds all user decks.',
  })
  async findAll(
    @Args() findAllDecksInput: FindAllDecksInput,
    @EdgesFields() attributes: ParsedField,
    @CurrentUser() user: Partial<User>,
  ): Promise<PaginatedDecks> {
    return await this.deckService.findAll({
      ...findAllDecksInput,
      attributes,
      userId: user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Deck, { name: 'deck', description: 'Finds a user deck.' })
  async findOne(
    @Args('id', { type: () => Int }) id: number,
    @Fields() attributes: ParsedField,
    @CurrentUser() user: Partial<User>,
  ): Promise<Deck> {
    return await this.deckService.findOne({ id, attributes, userId: user.id });
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UpdateOutput, { description: 'Updates a user deck.' })
  async updateDeck(
    @Args() updateDeckInput: UpdateDeckInput,
    @CurrentUser() user: Partial<User>,
  ): Promise<UpdateOutput> {
    const updated = await this.deckService.update({
      ...updateDeckInput,
      userId: user.id,
    });

    return {
      status: updated ? UPDATE_STATUS_SUCCESS : UPDATE_STATUS_ERROR,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => RemoveOutput, { description: 'Removes a user deck.' })
  async removeDeck(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: Partial<User>,
  ): Promise<RemoveOutput> {
    const removed = await this.deckService.remove({ id, userId: user.id });
    return {
      status: removed ? REMOVE_STATUS_SUCCESS : REMOVE_STATUS_ERROR,
    };
  }
}
