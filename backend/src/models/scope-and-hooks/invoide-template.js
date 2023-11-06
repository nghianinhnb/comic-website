// import { InvoiceTemplate, Background, Border, Field, Category } from "..";


// InvoiceTemplate.addScope('overview', {
//     attributes: [
//         'invoiceTemplateId', 'name', 'description', 'form', 'hasTaCode', 'year','type',
//         'managementCode', 'paperSize', 'noOnCategory', 'thumbnail', 'active', 'updatedAt',
//         'directTranfer', 'createdByAccountId'
//     ],
//     include: [{model: Category}]
// })
// export const InvoiceTemplateOverView = InvoiceTemplate.scope('overview')


// InvoiceTemplate.addScope('detail', {
//     attributes: {
//         exclude: ['noOnCategory', 'thumbnail', 'categoryId', 'backgroundId', 'borderId'],
//     },
//     include: [
//         {
//             model: Background,
//             attributes: ['backgroundId', 'filename', "name"],
//         },
//         {
//             model: Border,
//             attributes: ['borderId', 'filename'],
//         },
//         {
//             model: Field,
//             attributes: { exclude: ['invoiceTemplateId'] },
//         },
//         {
//             model: Category,
//         }
//     ],
// })
// export const InvoiceTemplateDetail = InvoiceTemplate.scope('detail')
