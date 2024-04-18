const ClassModelFactory = {
  findOne: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
};
ClassModelFactory.findAll.mockImplementation(() => {
  return [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ];
});

ClassModelFactory.count.mockImplementation(() => {
  return 2;
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
