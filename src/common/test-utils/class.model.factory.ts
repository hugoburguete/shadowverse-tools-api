const ClassModelFactory = {
  findOne: jest.fn(),
  findAndCountAll: jest.fn(),
};
ClassModelFactory.findAndCountAll.mockImplementation(() => {
  return {
    count: 2,
    rows: [
      {
        id: 1,
      },
      {
        id: 2,
      },
    ],
  };
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
