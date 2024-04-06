const rarityModelFactory = {
  findAll: jest.fn(),
};

rarityModelFactory.findAll.mockImplementation(() => {
  return [
    {
      id: 1,
    },
    {
      id: 2,
    },
  ];
});

export default rarityModelFactory;
