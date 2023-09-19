import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(fileName: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    try {
      return new Promise((resolve, reject) => {
        v2.config({
          cloud_name: 'dsvw15bam',
          api_key: '127567571788686',
          api_secret: 'EUCMcmXklShajONHfaCCJC8eSAk',
        });
        const upload = v2.uploader.upload_stream((error, result) => {
          if (error) return reject(error);
          resolve(result);
        });
        toStream(fileName.buffer).pipe(upload);
      });
    } catch {
      throw new UnauthorizedException();
    }
  }
}