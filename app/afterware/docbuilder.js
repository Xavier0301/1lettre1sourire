// As soon as a letter is approved, we build it.

// import { Document, Paragraph, Media, Packer } from "docx";
const docx = require('docx');

const https = require('https');    
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const sizeOf = require('image-size');
const libre = require('libreoffice-convert');

const batcher = require('./batcher');

function handleLetterFormatting(letter) {
    downloadImage(letter.imageUrl, letter.composedId, function(hasImage) {
        buildDoc(letter, hasImage, function() {
            convertToPdf(letter.composedId, function(path) {
                if(path) {
                    batcher(path, letter);
                }
            });
        });
    });
}

function downloadImage(url, fileName, callback) {
    const file = fs.createWriteStream(fileName);
    console.log('bout to dl image');
    https.get(url, function(response) {
        console.log('got resp from serv');
        if (response.statusCode === 200) {
            console.log('call good (200)');
            var stream = response.pipe(file);
            stream.on('finish', function() {
                sharp(fileName).resize(600, 350, {
                    fit: sharp.fit.inside
                }).toFormat('jpg').toFile(fileName + '.jpg', function(err) { 
                    fs.unlink(fileName, () => {});
                    if(err) {
                        console.log(err);
                        callback(false);
                    } else {
                        console.log('sharp good');
                        callback(true);
                    }
                })
            })
        } else {
            console.log('err req');
            file.close();
            fs.unlink(fileName, () => {}); // Delete temp file
            callback(false);
        }
    });
}

function buildDoc(letter, hasImage, callback) {
    const doc = new docx.Document(/*{styles: {
        paragraphStyles: [
            {
                id: "content",
                name: "Content",
                basedOn: "Normal",
                next: "Normal",
                run: {
                    size: 28
                }
            }
        ]
    }}*/);

    const logoImage = docx.Media.addImage(doc, fs.readFileSync(path.resolve("org_logo.png")), 80, 80);
    const attachedImagePath = path.resolve(letter.composedId + '.jpg');

    // That's clearly not optimal, but docx was not working when creating children as a list before this
    if(hasImage) {
        const attachedImageFile = fs.readFileSync(attachedImagePath);
        const dimensions = sizeOf(attachedImagePath);
        const attachedImage = docx.Media.addImage(doc, attachedImageFile, dimensions.width, dimensions.height);
        console.log('inside this bt');
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
                        }, 
                        size: 28
                    })]
                }),
                new docx.Paragraph(""),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.content,
                        font: {
                            name: 'Eido'
                        }, 
                        size: 28
                    })]
                }),
                new docx.Paragraph(""),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.signature,
                        font: {
                            name: 'Eido'
                        }, 
                        size: 28
                    })]
                }),
                new docx.Paragraph(""),
                new docx.Paragraph({
                    children: [attachedImage],
                    alignment: docx.AlignmentType.CENTER
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
                        }, 
                        size: 28
                    })]
                }),
                new docx.Paragraph(""),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.content,
                        font: {
                            name: 'Eido'
                        }, 
                        size: 28
                    })]
                }),
                new docx.Paragraph(""),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.signature,
                        font: {
                            name: 'Eido'
                        }, 
                        size: 28
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
        fs.unlink(attachedImagePath, () => {});
        callback();
    });
};

function convertToPdf(fileName, callback) {
    const inputPath = path.resolve(`docs/${fileName}.docx`);
    const outputPath = path.resolve(`docs/${fileName}.pdf`);

    const input = fs.readFileSync(inputPath);

    libre.convert(input, '.pdf', undefined, function(err,result) { 
        fs.unlink(inputPath, () => {});
        if(err){
            console.log(err);
            callback(undefined);
        } else {
            fs.writeFileSync(outputPath, result);
            callback(outputPath);
        }
    });
}

module.exports = handleLetterFormatting;