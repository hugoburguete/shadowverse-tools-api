import { FindOptions } from 'sequelize';
import { Card } from 'src/card/entities/card.entity';

const CardModelFactory = {
  findAll: jest.fn(),
  findOne: jest.fn(),
};

CardModelFactory.findAll.mockImplementation((args: FindOptions<Card>) => {
  // Dummy filtering
  if (args.where) {
    return [
      {
        id: 1,
      },
    ];
  }

  return [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ];
});

export default CardModelFactory;
