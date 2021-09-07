const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const createPDF = async (pdfTemplateName, imageName) => {
  try {
    const filePath = path.normalize(path.join(__dirname, pdfTemplateName));
    const pdfWritePath = path.normalize(
      path.join(__dirname, `test_${Date.now()}`)
    );
    const formPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();

    await setQRImage(
      form,
      "qr",
      path.normalize(path.join(__dirname, imageName)),
      pdfDoc
    );

    form.flatten();
    const pdfBytes = await pdfDoc.save();
    const uri = writeFile(pdfBytes, `${pdfWritePath}.pdf`);
    return uri;
  } catch (error) {
    console.log(error);
  }
};

const setQRImage = async (form, struct, qrPath, pdfDoc) => {
  try {
    const field = form.getButton(struct);
    const imageUInt8Array = fs.readFileSync(qrPath);
    const pngImage = await pdfDoc.embedPng(imageUInt8Array);
    field.setImage(pngImage);
  } catch (error) {
    console.log(error);
  }
};

const writeFile = (pdfBytes, pdfLocalPath) => {
  try {
    const fullPath = pdfLocalPath;
    fs.writeFileSync(pdfLocalPath, pdfBytes);
    return fullPath;
  } catch (error) {
    console.error(error);
    return null;
  }
};

exports.createPDF = createPDF;
