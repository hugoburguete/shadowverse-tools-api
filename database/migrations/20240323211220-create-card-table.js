'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      cardId: Sequelize.STRING,
      name: Sequelize.STRING,
      type: Sequelize.STRING,
      class: Sequelize.STRING,
      trait: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cost: {
        type: Sequelize.TINYINT,
        allowNull: true,
      },
      attack: {
        type: Sequelize.TINYINT,
        allowNull: true,
      },
      health: {
        type: Sequelize.TINYINT,
        allowNull: true,
      },
      image: Sequelize.STRING,
    });
  },

  async down(queryInterface) {
    queryInterface.dropTable('cards');
  },
};
