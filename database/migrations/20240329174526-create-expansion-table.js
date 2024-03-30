'use strict';

const CARDS_TABLE_NAME = 'cards';
const EXPANSIONS_TABLE_NAME = 'expansions';

const EXPANSION_ID_COLUMN_NAME = 'expansionId';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create table
    await queryInterface.createTable(EXPANSIONS_TABLE_NAME, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      slug: Sequelize.STRING,
      name: Sequelize.STRING,
      releaseDate: Sequelize.DATE,
    });

    // Create the first expansion
    await queryInterface.bulkInsert(EXPANSIONS_TABLE_NAME, [
      {
        slug: 'bp-01-advent-of-genesis',
        name: 'BP01: Advent of Genesis',
        releaseDate: new Date('June 30, 2023'),
      },
    ]);

    // Add card relation
    queryInterface.addColumn(CARDS_TABLE_NAME, EXPANSION_ID_COLUMN_NAME, {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      after: 'cardId',
      references: {
        model: 'expansions',
        key: 'id',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      CARDS_TABLE_NAME,
      EXPANSION_ID_COLUMN_NAME,
    );
    await queryInterface.dropTable(EXPANSIONS_TABLE_NAME);
  },
};
