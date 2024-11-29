# PDFWala 📄✨

## Overview

**PDFWala** is a robust Node.js library designed for efficient PDF manipulation. It offers tools for parsing, extracting, searching, and analyzing PDF content, all with detailed error handling to ensure smooth operations.

![npm version](https://img.shields.io/npm/v/pdfwala.svg)
![downloads](https://img.shields.io/npm/dm/pdfwala.svg)
![license](https://img.shields.io/npm/l/pdfwala.svg)

## 🚀 Features

- **Text Extraction**: Convert PDFs to text, line by line.
- **Advanced Search**: Locate content with optional case sensitivity.
- **Metadata Retrieval**: Access detailed PDF metadata.
- **Page Management**: Extract specific pages or count total pages.
- **File Conversion**: Save PDFs as plain text files.
- **Custom Error Handling**: Comprehensive error types for precise debugging.

## 📦 Installation

Install PDFWala and its dependencies using npm:

```bash
npm install pdfwala pdf-parse pdf-lib
```

## 💡 Quick Start

```javascript
const PDFKit = require('pdfwala');
const pdfKit = new PDFKit();

async function example() {
  try {
    // Parse PDF to array of lines
    const lines = await pdfKit.intoarray('document.pdf');

    // Get page count
    const pageCount = await pdfKit.getPageCount('document.pdf');

    // Search text
    const results = await pdfKit.searchText('document.pdf', 'keyword');

    // Get PDF metadata
    const metadata = await pdfKit.getMetadata('document.pdf');
    
    console.log({ lines, pageCount, results, metadata });
  } catch (error) {
    console.error('PDF processing error:', error);
  }
}

example();
```

---

## 🔍 Detailed API Documentation

### `async intoarray(filePath)`
Parses a PDF into an array of text lines.

```javascript
const lines = await pdfKit.intoarray('document.pdf');
// Output: ['Line 1 text', 'Line 2 text', ...]
```

---

### `async getPageCount(filePath)`
Returns the total number of pages in a PDF.

```javascript
const pageCount = await pdfKit.getPageCount('document.pdf');
// Output: 10
```

---

### `async searchText(filePath, searchTerm, options = { caseSensitive: false })`
Searches for a specific text term in a PDF. 

```javascript
const results = await pdfKit.searchText('document.pdf', 'example', { caseSensitive: false });
// Output: Array of lines containing 'example'
```

---

### `async extractPages(inputPath, outputPath, pageNumbers)`
Extracts specified pages from a PDF into a new file.

```javascript
await pdfKit.extractPages('input.pdf', 'output.pdf', [1, 2, 4]);
// Pages 1, 2, and 4 are saved to 'output.pdf'
```

---

### `async getMetadata(filePath)`
Retrieves detailed metadata from a PDF.

```javascript
const metadata = await pdfKit.getMetadata('document.pdf');
/*
Output:
{
  totalPages: 5,
  totalText: 'Full PDF content as text',
  textLength: 1200,
  filename: 'document.pdf'
}
*/
```

---

### `async convertToText(inputPath, outputPath)`
Converts the entire PDF to a plain text file.

```javascript
await pdfKit.convertToText('document.pdf', 'output.txt');
// PDF content saved to 'output.txt'
```

---

## 🛠 Error Handling

PDFWala employs the custom `PDFKitError` class for error handling. Each error has a specific type, such as:
- **FileNotFound**: File does not exist.
- **InvalidFileType**: File is not a PDF.
- **ParseError**: Issues during parsing.
- **SearchError**: Problems with search operations.

These ensure precise troubleshooting and a reliable developer experience.

---

## 🔒 Requirements

- **Node.js**: v12.0.0 or higher
- **Dependencies**:
  - `pdf-parse`
  - `pdf-lib`

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request for review.

---

## 📝 License

Distributed under the ISC License. See `LICENSE` for details.

---

## 📌 Contact

- **Author**: Rawal Suthar  
- **Email**: rawal@suthar.dev  
- **Project Link**: [https://github.com/mrsuthar/pdfwala.git](https://github.com/mrsuthar/pdfwala.git)

---

**Happy PDF Parsing with PDFWala!** 🎉