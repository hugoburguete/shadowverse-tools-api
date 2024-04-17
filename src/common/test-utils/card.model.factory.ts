const CardModelFactory = {
  findAll: jest.fn(),
  count: jest.fn(),
};

CardModelFactory.findAll.mockImplementation(() => {
  return [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ];
});

CardModelFactory.count.mockImplementation(() => {
  return 2;
});

export default CardModelFactory;
