import { Injectable } from '@nestjs/common';
import { Card } from './card.model';
import { SearchCardsArgs } from './dto/search.args';

@Injectable()
export class CardService {
  private readonly cards: Array<Card> = [
    {
      cardId: 'BP01-116',
      image: 'https://images.shadowcard.io/images/cards/BP01-116.jpg',
      name: 'Soul Conversion',
      class: 'Abbysscraft',
      cost: 1,
      trait: 'Departed',
      type: 'Spell',
    },
    {
      cardId: 'BP01-LD10',
      image: 'https://images.shadowcard.io/images/cards/BP01-LD10.jpg',
      name: 'Urias',
      class: 'Abbysscraft',
      type: 'Leader',
    },
    {
      cardId: 'CP01-028',
      image: 'https://images.shadowcard.io/images/cards/CP01-028.jpg',
      name: 'Agnes Tachyon (Evolved)',
      class: 'Runecraft',
      trait: 'Umamusume',
      type: 'Follower / Evolved',
      attack: 3,
      health: 3,
    },
    {
      cardId: 'BP03-023',
      image: 'https://images.shadowcard.io/images/cards/BP03-023.jpg',
      name: 'Amerro, Spear Knight',
      class: 'Swordcraft',
      cost: 2,
      trait: 'Officer / Heroic',
      type: 'Follower',
    },
  ];

  findAll(): Card[] {
    return this.cards;
  }

  searchCards(searchCriteria: SearchCardsArgs): Card[] {
    const searchTerm = searchCriteria.searchTerm.toLowerCase();
    return this.cards.filter(
      (card) => card.name.toLowerCase().indexOf(searchTerm) >= 0,
    );
  }
}
