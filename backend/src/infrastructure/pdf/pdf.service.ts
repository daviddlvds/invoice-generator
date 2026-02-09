import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { registerHelpers } from './helpers';
import { Readable } from 'stream';
const wkhtmltopdf = require('wkhtmltopdf');

export function generatePdfFromTemplate(
  templateName: string,
  params: any
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const templatePath = path.join(__dirname, 'templates', templateName);
      const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

      registerHelpers();
      registerGlobalPartials();
      const template = handlebars.compile(htmlTemplate);
      const html = template(params);

      const stream: Readable = wkhtmltopdf(html, {
        pageSize: 'A4',
        encoding: 'UTF-8',
      });

      const chunks: Buffer[] = [];

      stream.on('data', (chunk: Buffer) => chunks.push(chunk));
      stream.on('end', () => {
        const buffer = Buffer.concat(chunks);

        if (!buffer.slice(0, 4).toString().includes('%PDF')) {
          return reject(new Error('wkhtmltopdf did not return a valid PDF'));
        }

        resolve(buffer);
      });

      stream.on('error', reject);
    } catch (e) {
      reject(e);
    }
  });
}

function registerGlobalPartials() {
  const basePath = path.join(__dirname, 'templates', 'partials');

  ['header', 'footer'].forEach((name) => {
    const file = fs.readFileSync(
      path.join(basePath, `${name}.html`),
      'utf-8'
    );
    handlebars.registerPartial(name, file);
  });
}

