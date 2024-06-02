import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'src/auth/decorators/currentuser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Fields, ParsedField } from 'src/common/decorators/fields.decorator';
import { User } from 'src/user/entities/user.entity';
import { CollectionsService } from './collections.service';
import { CreateOrUpdateCollectionInput } from './dto/create-or-update-collection.input';
import { Collection } from './entities/collection.entity';

@Resolver(() => Collection)
export class CollectionsResolver {
  constructor(private readonly collectionsService: CollectionsService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Collection)
  async createOrUpdateCollection(
    @Args('input')
    createCollectionInput: CreateOrUpdateCollectionInput,
    @Fields() attributes: ParsedField,
    @CurrentUser() user: Partial<User>,
  ) {
    createCollectionInput.userId = user.id;
    return await this.collectionsService.createOrUpdate(
      createCollectionInput,
      attributes,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Collection, { name: 'collection' })
  findOne(
    @Fields() attributes: ParsedField,
    @CurrentUser() user: Partial<User>,
  ) {
    return this.collectionsService.findOne({
      userId: user.id,
      attributes,
    });
  }
}
