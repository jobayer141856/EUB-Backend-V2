import { Buffer } from 'node:buffer';
import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import nanoid from '@/lib/nanoid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function uploadFile(file: any, folderName: string) {
  const buffer = await file.arrayBuffer(); // Ensure this is awaited

  const upload_path = `/uploads/${folderName}/${nanoid()}.${file.name.split('.').pop()}`;
  const fullUploadPath = path.join(__dirname, '../../', upload_path);

  // Ensure the directory exists
  fs.mkdirSync(path.dirname(fullUploadPath), { recursive: true });

  fs.writeFileSync(fullUploadPath, Buffer.from(buffer));

  return upload_path;
}

export async function deleteFile(filePath: string) {
  // delete the file
  const fullFilePath = path.join(__dirname, '../../', filePath);
  fs.unlinkSync(fullFilePath);
}

export async function updateFile(file: any, filePath: string, folderName: string) {
  // delete the old file
  deleteFile(filePath);

  // upload the new file
  return uploadFile(file, folderName);
}
