const pdfparse = require('pdf-parse');
const fs = require('fs');

class PDFKit {
    intoarray(path) {
        return new Promise((resolve, reject) => {
            const pdf = fs.readFileSync(path);
            pdfparse(pdf).then(
                (data) => resolve(data.text.split('\n'))
            ).catch(
                (err) => reject(err)
            );
        });
    }
}
module.exports = PDFKit;