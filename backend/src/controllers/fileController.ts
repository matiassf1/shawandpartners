import ConvertCsvToJson from 'convert-csv-to-json';
import UserModel from '../models/UserModel';
import { Request, Response } from 'express';
import { Person } from '../interfaces';
import FileUploadService from '../services/fileUpload';

class FileController {
    constructor(private fileUploadService: FileUploadService, private userModel: UserModel) { }

    uploadFile = async (req: Request, res: Response) => {

        const uploadMiddleware = this.fileUploadService.getMiddleware();

        uploadMiddleware(req, res, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Upload error' });
            }
            const { file } = req;
            if (!file) {
                return res.status(500).json({ message: 'File is required' });
            }
            if (file.mimetype !== 'text/csv') {
                return res.status(500).json({ message: 'File must be CSV' });
            }

            try {
                const rawCsv = Buffer.from(file.buffer).toString('utf-8');
                console.log(rawCsv);
                
                let userData: Person[];
                try {
                    userData = ConvertCsvToJson.fieldDelimiter(',').csvStringToJson(rawCsv);
                } catch (conversionError) {
                    console.error('Error converting CSV to JSON:', conversionError);
                    return res.status(500).json({ message: 'Error converting CSV to JSON' });
                }

                this.userModel.storeUserData(userData);
                res.status(200).json({ data: userData, message: 'The file was successfully uploaded' });
            } catch (error) {
                console.error('Error parsing the file:', error);
                res.status(500).json({ message: 'Error parsing the file' });
            }
        });
    };

}

export default FileController;
