import {DataTypes, Sequelize} from 'sequelize';

import {sequelize} from './sequelize';


export const Account = sequelize.define('account',
    {
        accountId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            allowNull: false,
        },
        accessToken: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        timestamps: false,
    }
)
