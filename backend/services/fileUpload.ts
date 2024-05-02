import { RequestHandler } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import multer, { memoryStorage } from 'multer';
import { ParsedQs } from 'qs';

class FileUploadService {
    public upload: RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>;
    constructor() {
        const storage = memoryStorage();
        this.upload = multer({ storage }).single('file');
    }

    getMiddleware() {
        return this.upload;
    }
}

export default FileUploadService;
