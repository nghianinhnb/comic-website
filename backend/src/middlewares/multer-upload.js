import { v4 } from "uuid"
import multer from "multer"
import { mkdir } from "fs/promises"
import { join, resolve, extname } from "path"

import { BadRequestError } from "../errors"


const publicStorage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const dir = join(resolve('public'), file.fieldname.replace(/\[\d+\]$/, ""))
        await mkdir(dir, {recursive: true})
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        cb(null, v4() + extname(file.originalname))
    }
})


const privateStorage = multer.diskStorage({
    destination: async function (req, file, cb) {
        const dir = join(process.env.STORAGE_DIR, req.user.accountId, file.fieldname)
        await mkdir(dir, {recursive: true})
        cb(null, dir)
    },
    filename: function (req, file, cb) {
        cb(null, v4() + extname(file.originalname))
    }
})


export const uploadPublicImage = multer({
    storage: publicStorage,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
    fileFilter: imageFileFilter,
})


export const uploadPrivateRecourses = multer({
    storage: privateStorage,
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
})


// -------------------------------------------------


function imageFileFilter(req, file, cb) {
    const acceptExt = ['.png', '.jpg', '.jpeg', '.svg']
    if (acceptExt.includes( extname(file.originalname) )) return cb(null, true)
    cb(new BadRequestError([{msg: 'Định dạng ảnh không hợp lệ'}]))
}
