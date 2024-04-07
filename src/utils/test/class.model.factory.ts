import { FindOptions } from 'sequelize';
import { Class } from 'src/class/entities/class.entity';

const ClassModelFactory = {
  findOne: jest.fn(),
  findAll: jest.fn(),
};
ClassModelFactory.findAll.mockImplementation((args: FindOptions<Class>) => {
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

ClassModelFactory.findOne.mockImplementation((args) => {
  if ([1, 2].includes(args.where.id)) {
    return {
      id: args.where.id,
    };
  }

  return null;
});

export default ClassModelFactory;
