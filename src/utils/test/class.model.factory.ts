const ClassModelFactory = {
  findOne: jest.fn(),
};

ClassModelFactory.findOne.mockImplementation((args) => {
  if ([1, 2].includes(args.where.id)) {
    return {
      id: args.where.id,
    };
  }

  return null;
});

export default ClassModelFactory;
