'use strict';

const rarities = [
  {
    id: 1,
    name: 'Legendary',
    acronym: 'LG',
  },
  {
    id: 2,
    name: 'Gold',
    acronym: 'GR',
  },
  {
    id: 3,
    name: 'Silver',
    acronym: 'SR',
  },
  {
    id: 4,
    name: 'Bronze',
    acronym: 'BR',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rarities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      name: Sequelize.STRING,
      acronym: Sequelize.STRING(3),
    });

    await queryInterface.bulkInsert('rarities', rarities);

    await queryInterface.addColumn('cards', 'rarityId', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      references: {
        model: 'rarities',
        key: 'id',
      },
    });

    rarities.forEach(async (rarity) => {
      await queryInterface.bulkUpdate(
        'cards',
        { rarityId: rarity.id },
        { rarity: rarity.acronym },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TABLE cards DROP FOREIGN KEY cards_rarityId_foreign_idx;`,
    );
    await queryInterface.removeColumn('cards', 'rarityId');
    await queryInterface.dropTable('rarities');
  },
};
