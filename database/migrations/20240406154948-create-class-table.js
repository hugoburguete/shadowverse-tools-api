'use strict';

const classes = [
  {
    id: 1,
    name: 'Forestcraft',
    slug: 'forestcraft',
  },
  {
    id: 2,
    name: 'Swordcraft',
    slug: 'swordcraft',
  },
  {
    id: 3,
    name: 'Runecraft',
    slug: 'runecraft',
  },
  {
    id: 4,
    name: 'Dragoncraft',
    slug: 'dragoncraft',
  },
  {
    id: 5,
    name: 'Abysscraft',
    slug: 'abysscraft',
  },
  {
    id: 6,
    name: 'Havencraft',
    slug: 'havencraft',
  },
  {
    id: 7,
    name: 'Neutral',
    slug: 'neutral',
  },
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('classes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    await queryInterface.bulkInsert('classes', classes);

    await queryInterface.addColumn('cards', 'classId', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
      references: {
        model: 'classes',
        key: 'id',
      },
    });

    classes.forEach(async (clas) => {
      await queryInterface.bulkUpdate(
        'cards',
        { classId: clas.id },
        { class: clas.name },
      );
    });

    await queryInterface.removeColumn('cards', 'class');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TABLE cards DROP FOREIGN KEY cards_classId_foreign_idx;`,
    );
    await queryInterface.removeColumn('cards', 'classId');
    await queryInterface.dropTable('classes');
  },
};
