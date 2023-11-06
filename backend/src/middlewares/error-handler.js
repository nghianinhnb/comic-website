import fs from 'fs/promises';
import { MulterError } from 'multer';
import {ValidationError} from 'sequelize';

import {BaseHttpError, ERROR_INTERNAL, ERROR_NOT_VALID_PARAMETERS, ERROR_LIMIT_UNEXPECTED_FILE} from '../errors';


export async function errorHandler(err, req, res, next) {
    await removeTempUploadFile(req);

    if (err instanceof BaseHttpError) return res.status(err.statusCode).send(err.respond());

    console.error(err);

    if (err instanceof ValidationError) return res.status(400).send({message: [ERROR_NOT_VALID_PARAMETERS]});

    if (err instanceof MulterError && err.code === 'LIMIT_UNEXPECTED_FILE')
        return res.status(400).send({message: [ERROR_LIMIT_UNEXPECTED_FILE]});

    res.status(500).send({
        message: ERROR_INTERNAL,
    })
}


// ----------------------------------------------------------


function removeTempUploadFile(req) {
    const files = (req.file && [req.file]) || (req.files && (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()));
    if (!files) return
    return Promise.allSettled(files.map(file =>
        fs.rm(file.path, {force: true, maxRetries: 3})
    ))
}
