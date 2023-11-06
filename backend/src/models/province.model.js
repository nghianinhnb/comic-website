import { DataTypes } from "sequelize";

import { sequelize } from "./sequelize";


export const Province = sequelize.define(
    "province",
    {
        provinceId: {
            type: DataTypes.STRING(50),
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(100),
        },
    },
    {
        timestamps: false,
    }
);
