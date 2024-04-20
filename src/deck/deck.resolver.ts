import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/currentuser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/user/entities/user.entity';
import { DeckService } from './deck.service';
import { CreateDeckInput } from './dto/create-deck.input';
import { UpdateDeckInput } from './dto/update-deck.input';
import { Deck } from './entities/deck.entity';

@Resolver(() => Deck)
export class DeckResolver {
  constructor(private readonly deckService: DeckService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Deck)
  async createDeck(
    @Args('createDeckInput') createDeckInput: CreateDeckInput,
    @CurrentUser() user: User,
  ): Promise<Deck> {
    createDeckInput.userId = user.id;
    return await this.deckService.create(createDeckInput);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Deck], { name: 'deck' })
  async findAll(@CurrentUser() user: User): Promise<Deck[]> {
    return this.deckService.findAll(user.id);
  }

  @Query(() => Deck, { name: 'deck' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Deck> {
    return await this.deckService.findOne(id);
  }

  @Mutation(() => Deck)
  updateDeck(@Args('updateDeckInput') updateDeckInput: UpdateDeckInput) {
    return this.deckService.update(updateDeckInput.id, updateDeckInput);
  }

  @Mutation(() => Deck)
  removeDeck(@Args('id', { type: () => Int }) id: number) {
    return this.deckService.remove(id);
  }
}
