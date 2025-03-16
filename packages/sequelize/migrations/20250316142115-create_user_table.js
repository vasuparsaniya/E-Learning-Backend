'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'users',
        {
          id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          first_name: {
            type: Sequelize.STRING,
          },
          last_name: {
            type: Sequelize.STRING,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          password: {
            type: Sequelize.STRING,
          },
          created_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          deleted_at: {
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );

      await queryInterface.addConstraint('users', {
        fields: ['email'],
        type: 'unique',
        name: 'users_email_uk1',
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeConstraint('users', 'users_email_uk1', {
        transaction,
      });
      await queryInterface.dropTable('users', { transaction });
    });
  },
};
