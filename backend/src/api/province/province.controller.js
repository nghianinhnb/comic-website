import * as provinceService from "./province.service";


export async function all(req, res) {
    const provinces = await provinceService.all();
    res.send({provinces});
}


export async function create(req, res) {
    const province = await provinceService.create({...req.body})
    res.status(201).send({province});
}


export async function update(req, res) {
    await provinceService.update({...req.body})
    res.status(204).end();
}
