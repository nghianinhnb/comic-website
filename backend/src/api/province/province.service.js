import { Province } from "../../models";


export async function all() {
    return await Province.findAll({raw: true})
}


export async function create({ provinceId, name }) {
    const [province] = await Province.bulkCreate([{ provinceId, name }])
    return province
}


export async function update({ provinceId, name }) {
    await Province.update({ provinceId, name }, {where: {provinceId}})
}
