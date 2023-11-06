import { body, param } from "express-validator";

import { catchValidateError } from "../../middlewares";


export const getById = [
    param("companyId").isInt().withMessage("Id công ty, tổ chức phải là số"),

    catchValidateError,
];


export const update = [
    body('fullname')
        .optional()
        .trim()
        .escape(),
    body('taxCode')
        .custom((value, { req }) => {
            if (req.body.email || /^\d{10}(-\d{3})?$/.test(req.body.username)) return true;
            if (!/^\d{10}(-\d{3})?$/.test(value)) 
                throw new Error('Thiếu mã số thuế hoặc mã số thuế không hợp lệ');
            return true;
        }),
    body('website')
        .optional()
        .isURL({protocols: ['http','https']})
        .withMessage('Website không hợp lệ'),
    body('phone')
        .optional()
        .isMobilePhone(['vi-VN'])
        .withMessage('Số điện thoại không hợp lệ'),
    body('address')
        .optional()
        .trim()
        .escape(),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Email không hợp lệ')
        .normalizeEmail(),
    body('accountNumber')
        .optional()
        .custom(value => {
            if (!/^\d{8,16}$/.test(value)) throw new Error()
            return true
        })
        .withMessage('Số tài khoản ngân hàng không hợp lệ'),
    body('bankName')
        .optional()
        .trim()
        .escape(),
    body('contactPersonEmail')
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage('Email không hợp lệ'),
    body('contactPersonPhone')
        .optional()
        .isMobilePhone(['vi-VN'])
        .withMessage('Số điện thoại không hợp lệ'),
    body('contactPersonPosition')
        .optional()
        .trim()
        .escape(),
    body('contactPerson')
        .optional()
        .trim()
        .escape(),

    catchValidateError,
];
