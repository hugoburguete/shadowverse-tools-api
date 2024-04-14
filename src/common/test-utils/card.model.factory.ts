const CardModelFactory = {
  findAndCountAll: jest.fn(),
  findOne: jest.fn(),
};

CardModelFactory.findAndCountAll.mockImplementation(() => {
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

export default CardModelFactory;
