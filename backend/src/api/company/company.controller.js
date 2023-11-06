import { Province, TaxAuthority } from "../../models";
import * as companyService from "./company.service";
import provinces from "../../assets/instances/provinces.json" assert { type: "json" };
import tax_authority from "../../assets/instances/tax_authority.json" assert { type: "json" };

export async function getById(req, res) {
    const company = await companyService.getById(req.params.companyId);
    res.send(company);
}

export async function update(req, res) {
    await companyService
        .update({ ...req.body, ...req.user })
        .catch(companyErrorHandler);
    res.status(204).end();
}

export async function createInstanceTable(req, res) {
    try {
        const { type } = req.body;
        if (type === "provinces") {
            // Insert the data into the MySQL table using the Sequelize model's bulkCreate() method
            Province.bulkCreate(provinces)
                .then(() => {
                    res.send({ result: "Data inserted successfully" });
                })
                .catch((error) => {
                    res.send("Error inserting data: ", error);
                });
        } else {
            TaxAuthority.bulkCreate(tax_authority)
                .then(() => {
                    res.send({ result: "Data inserted successfully" });
                })
                .catch((error) => {
                    res.send({
                        result: "Error inserting data",
                        error: error.message,
                    });
                });
        }
    } catch (error) {
        if (error.response?.status === 400) throw new NotFoundError();
        throw error;
    }
}

// ---------------------------------------------------------------

function companyErrorHandler(error) {
    if (error.name === "SequelizeForeignKeyConstraintError")
        throw new BadRequestError("taxAuthorityId không tồn tại");

    throw error;
}
