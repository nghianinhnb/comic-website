import { DataTypes } from "sequelize";

import { sequelize } from "./sequelize";


export const Company = sequelize.define(
    "company",
    {
        companyId: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
        },
    },
    {
        timestamps: false,
    }
);
