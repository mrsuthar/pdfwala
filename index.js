const pdfparse = require('pdf-parse');
const fs = require('fs');
const path = require('path');

// Custom Error Class for more specific error handling
class PDFKitError extends Error {
    constructor(message, type = 'UnknownError') {
        super(message);
        this.name = 'PDFKitError';
        this.type = type;
    }
}

class PDFKit {
    /**
     * Validate file path
     * @private
     * @param {string} filePath - Path to the PDF file
     * @throws {PDFKitError} If file doesn't exist or is not a PDF
     */
    _validateFilePath(filePath) {
        if (!fs.existsSync(filePath)) {
            throw new PDFKitError(`File not found: ${filePath}`, 'FileNotFound');
        }

        const ext = path.extname(filePath).toLowerCase();
        if (ext !== '.pdf') {
            throw new PDFKitError(`Invalid file type. Expected .pdf, got ${ext}`, 'InvalidFileType');
        }
    }

    /**
     * Parse PDF and return text as an array of lines
     * @param {string} filePath - Path to the PDF file
     * @returns {Promise<string[]>} Array of lines from the PDF
     */
    async intoarray(filePath) {
        try {
            this._validateFilePath(filePath);

            const pdf = fs.readFileSync(filePath);
            const data = await pdfparse(pdf);
            return data.text.split('\n');
        } catch (err) {
            if (err instanceof PDFKitError) throw err;
            else throw new PDFKitError(`Failed to parse PDF: ${err.message}`, 'ParseError');
        }
    }

    /**
     * Get total page count of the PDF
     * @param {string} filePath - Path to the PDF file
     * @returns {Promise<number>} Total number of pages
     */
    async getPageCount(filePath) {
        try {
            this._validateFilePath(filePath);

            const pdf = fs.readFileSync(filePath);
            const data = await pdfparse(pdf);
            return data.numpages;
        } catch (err) {
            if (err instanceof PDFKitError) throw err;
            else throw new PDFKitError(`Failed to get page count: ${err.message}`, 'PageCountError');
        }
    }

    /**
     * Search for specific text within a PDF
     * @param {string} filePath - Path to the PDF file
     * @param {string} searchTerm - Text to search for
     * @param {Object} [options] - Search options
     * @param {boolean} [options.caseSensitive=false] - Whether search is case-sensitive
     * @returns {Promise<string[]>} Array of lines containing the search term
     */
    async searchText(filePath, searchTerm, options = {}) {
        try {
            this._validateFilePath(filePath);
            const { caseSensitive = false } = options;
            if (!searchTerm) {
                throw new PDFKitError('Invalid search terms provided', 'InvalidSearchTerm');
            }
            const lines = await this.intoarray(filePath);
            const searchFunc = caseSensitive
                ? line => line.includes(searchTerm)
                : line => line.toLowerCase().includes(searchTerm.toLowerCase());

            return lines.filter(searchFunc);
        } catch (err) {
            if (err instanceof PDFKitError) throw err;
            else throw new PDFKitError(`Failed to search PDF: ${err.message}`, 'SearchError');
        }
    }

    /**
     * Extract specific pages from a PDF and create a new PDF
     * @param {string} inputPath - Path to the input PDF
     * @param {string} outputPath - Path to save extracted PDF
     * @param {number[]} pageNumbers - Array of page numbers to extract
     */
    async extractPages(inputPath, outputPath, pageNumbers) {
        try {
            this._validateFilePath(inputPath);

            if (!outputPath) {
                throw new PDFKitError('Invalid path provided', 'InvalidOutputPath');
            }

            if (!pageNumbers || !Array.isArray(pageNumbers) || pageNumbers.length === 0) {
                throw new PDFKitError('Invalid page numbers provided', 'InvalidPageNumbers');
            }

            const { PDFDocument } = require('pdf-lib');

            const sourcePdfBytes = fs.readFileSync(inputPath);
            const pdfDoc = await PDFDocument.load(sourcePdfBytes);
            const newPdfDoc = await PDFDocument.create();

            for (const pageNum of pageNumbers) {
                if (pageNum > 0 && pageNum <= pdfDoc.getPageCount()) {
                    const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
                    newPdfDoc.addPage(copiedPage);
                } else {
                    console.warn(`Page number ${pageNum} is out of range and will be skipped.`);
                }
            }

            const pdfBytes = await newPdfDoc.save();
            fs.writeFileSync(outputPath, pdfBytes);
        } catch (err) {
            if (err instanceof PDFKitError) throw err;
            else throw new PDFKitError(`Failed to extract pages: ${err.message}`, 'ExtractPagesError');
        }
    }

    /**
     * Get metadata of the PDF
     * @param {string} filePath - Path to the PDF file
     * @returns {Promise<Object>} PDF metadata
     */
    async getMetadata(filePath) {
        try {
            this._validateFilePath(filePath);

            const pdf = fs.readFileSync(filePath);
            const data = await pdfparse(pdf);
            return {
                totalPages: data.numpages,
                totalText: data.text,
                textLength: data.text.length,
                filename: path.basename(filePath)
            };
        } catch (err) {
            if (err instanceof PDFKitError) throw err;
            else throw new PDFKitError(`Failed to get metadata: ${err.message}`, 'MetadataError');
        }
    }

    /**
     * Convert PDF to plain text file
     * @param {string} inputPath - Path to the input PDF
     * @param {string} outputPath - Path to save text file
     * @returns {Promise<string>} Converted text or writes to file
     */
    async convertToText(inputPath, outputPath) {
        try {
            this._validateFilePath(inputPath);
            const lines = await this.intoarray(inputPath);
            if (outputPath) {
                fs.writeFileSync(outputPath, lines.join('\n'));
                return '';
            }
            return lines.join('\n');
        } catch (err) {
            if (err instanceof PDFKitError) throw err;
            else throw new PDFKitError(`Failed to convert PDF to text: ${err.message}`, 'ConvertToTextError');
        }
    }
}

module.exports = PDFKit;