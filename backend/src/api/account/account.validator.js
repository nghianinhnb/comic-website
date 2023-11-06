import { body } from "express-validator";

import { catchValidateError } from "../../middlewares";


export const signIn = [
    body('taxCode')
        .custom((value, { req }) => {
            if (req.body.email || /^\d{10}(-\d{3})?$/.test(req.body.username)) return true;
            if (!/^\d{10}(-\d{3})?$/.test(value)) 
                throw new Error('Thiếu mã số thuế hoặc mã số thuế không hợp lệ');
            return true;
        }),
    body('password')
        .notEmpty()
        .withMessage('Thiếu mật khẩu'),

    catchValidateError,
]


export const signUp = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Thiếu email hoặc email không hợp lệ'),
    body('taxCode')
        .custom(value => {
            if (!/^\d{10}(-\d{3})?$/.test(value)) 
                throw new Error('Thiếu mã số thuế hoặc mã số thuế không hợp lệ');
            return true;
        }),
    body('password')
        .notEmpty()
        .withMessage('Thiếu mật khẩu'),
    body('fullname')
        .notEmpty()
        .trim()
        .escape()
        .withMessage('Thiếu tên công ty'),
    body('phone')
        .optional()
        .isMobilePhone(['vi-VN'])
        .withMessage('Số điện thoại không hợp lệ'),

    catchValidateError,
]


export const changePassword = [
    body('oldPassword')
        .notEmpty()
        .withMessage('Thiếu mật khẩu'),
    body('newPassword')
        .custom((value, { req }) => {
            if (value === req.body.oldPassword)
                throw new Error('Mật khẩu mới phải khác mật khẩu cũ')
            return true
        })
        .notEmpty()
        .withMessage('Thiếu mật khẩu mới'),

    catchValidateError,
]


export const createStaff = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Thiếu email hoặc email không hợp lệ'),
    body('taxCode')
        .custom(value => {
            if (!/^\d{10}(-\d{3})?$/.test(value)) 
                throw new Error('Thiếu mã số thuế hoặc mã số thuế không hợp lệ');
            return true;
        }),
    body('username')
        .notEmpty()
        .withMessage('Thiếu tên đăng nhập'),
    body('password')
        .notEmpty()
        .withMessage('Thiếu mật khẩu'),
    body('fullname')
        .notEmpty()
        .trim()
        .escape()
        .withMessage('Thiếu họ và tên'),
    body('phone')
        .optional()
        .isMobilePhone(['vi-VN'])
        .withMessage('Số điện thoại không hợp lệ'),

    catchValidateError,
]


export const updateMe = [
    body('companyName')
        .optional()
        .trim()
        .escape(),
    body('address')
        .optional()
        .trim()
        .escape(),
    body('fullname')
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
    body('phone')
        .optional()
        .isMobilePhone(['vi-VN'])
        .withMessage('Số điện thoại không hợp lệ'),
    body('contactPersonPosition')
        .optional()
        .trim()
        .escape(),
    body('personalIdentificationNumber')
        .optional()
        .custom(value => {
            if (!/^\d{9}(\d{3})?$/.test(value)) throw new Error()
            return true
        })
        .withMessage('CMND/CCCD không hợp lệ'),
    body('website')
        .optional()
        .isURL({protocols: ['http','https']})
        .withMessage('Website không hợp lệ'),
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
    body('contactPerson')
        .optional()
        .trim()
        .escape(),

    catchValidateError,
]


export const updateStaff = [
    body('taxCode')
        .optional()
        .custom(value => {
            if (!/^\d{10}(-\d{3})?$/.test(value)) 
                throw new Error('Mã số thuế không hợp lệ');
            return true;
        }),
    body('username')
        .optional()
        .isString()
        .withMessage('Tên đăng nhập không hợp lệ'),
    body('password')
        .optional(),
    body('fullname')
        .optional()
        .trim()
        .escape(),

    catchValidateError,
]


export const deleteStaff = [
    body('accountIds')
        .isArray({min: 1})
        .withMessage('Thiếu mảng accountIds hoặc mảng rỗng'),

    catchValidateError,
]
