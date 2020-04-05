// As soon as a letter is approved, we build it.

// import { Document, Paragraph, Media, Packer } from "docx";
const docx = require('docx');

const https = require('https');
const fs = require('fs');
// const sharp = require('sharp');
const path = require('path');

const libre = require('libreoffice-convert');

function handleLetterFormatting(letter) {
    downloadImage(letter.imageUrl, letter.composedId, function(imageSize) {
        buildDoc(letter, undefined, function() {
            convertToPdf(letter.composedId);
        });
    });
}

function downloadImage(url, fileName, callback) {
    const file = fs.createWriteStream(fileName);
    const request = https.get(url, function(response) {
        if (response.statusCode === 200) {
            response.pipe(file);
            sharp(fileName).resize(400,400).max().toFile(fileName, function(err) { 
                if(err) {
                    callback(undefined);
                } else {
                    callback({ width: 400, height: 400});
                }
            })
        } else {
            file.close();
            fs.unlink(fileName, () => {}); // Delete temp file
            callback(undefined);
        }
    });
}

function buildDoc(letter, imageSize, callback) {
    const doc = new docx.Document({styles: {
        paragraphStyles: [
            {
                id: "content",
                name: "Content",
                basedOn: "Normal",
                next: "Normal",
                size: 14,
            }
        ]
    }});

    const logoImage = docx.Media.addImage(doc, fs.readFileSync(path.resolve("org_logo.png")), 100, 100);

    console.log(letter.greeting);
    console.log(letter);

    // That's clearly not optimal, but docx was not working when creating children as a list before this
    if(imageSize !== undefined) {
        const attachedImage = docx.Media.addImage(doc, fs.readFileSync(path.resolve(letter.composedId)));
        doc.addSection({
            children: [
                new docx.Paragraph(logoImage, 100, 100),
                new docx.Paragraph(""),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.heading,
                        font: {
                            name: 'Eido'
                        }
                    })]
                }),
                new docx.Paragraph(""),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.content,
                        font: {
                            name: 'Eido'
                        }
                    })]
                }),
                new docx.Paragraph(""),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.signature,
                        font: {
                            name: 'Eido'
                        }
                    })]
                }),
                new docx.Paragraph(),
                new docx.Paragraph(attachedImage, imageSize.width, imageSize.height)],
            footers: {
                default: new docx.Footer({
                    children: [new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: letter.composedId,
                                font: {
                                    name: 'Calibri'
                                }
                            })
                        ]
                    })]
                })
            }
        });
    } else {
        doc.addSection({
            children: [
                new docx.Paragraph({
                    children: [logoImage],
                    alignment: docx.AlignmentType.CENTER
                }),
                new docx.Paragraph(""),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.heading,
                        font: {
                            name: 'Eido'
                        }
                    })]
                }),
                new docx.Paragraph(""),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.content,
                        font: {
                            name: 'Eido'
                        }
                    })]
                }),
                new docx.Paragraph(""),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.signature,
                        font: {
                            name: 'Eido'
                        }
                    })]
                })],
            footers: {
                default: new docx.Footer({
                    children: [new docx.Paragraph({
                        children: [
                            new docx.TextRun({
                                text: letter.composedId,
                                font: {
                                    name: 'Calibri'
                                }
                            })
                        ]
                    })]
                })
            }
        });
    }
    
    docx.Packer.toBuffer(doc).then((buffer) => {
        try {
            fs.writeFileSync(path.resolve(`docs/${letter.composedId}.docx`), buffer);
        } catch(err) {
            console.log(err);
        }
        callback();
    });
};

function convertToPdf(fileName) {
    const inputPath = path.resolve(`docs/${fileName}.docx`);
    const outputPath = path.resolve(`docs/${fileName}.pdf`);

    const input = fs.readFileSync(inputPath);

    libre.convert(input, '.pdf', undefined, function(err,result) { 
        if(err){
            console.log(err);
        } else {
            fs.writeFileSync(outputPath, result);
        }
    });
}

module.exports = handleLetterFormatting;