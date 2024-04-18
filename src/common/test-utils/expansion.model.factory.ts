import { FindOptions } from 'sequelize';
import { Expansion } from 'src/expansion/entities/expansion.entity';

const expansionModelFactory = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  count: jest.fn(),
};

expansionModelFactory.findAll.mockImplementation(
  (args: FindOptions<Expansion>) => {
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
  },
);

expansionModelFactory.count.mockImplementation(() => {
  return 2;
});

expansionModelFactory.findOne.mockImplementation((args) => {
  if ([1, 2].includes(args.where.id)) {
    return {
      id: args.where.id,
    };
  }

  return null;
});

export default expansionModelFactory;
