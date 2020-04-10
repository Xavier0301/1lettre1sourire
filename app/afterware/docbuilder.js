// As soon as a letter is approved, we build it.
const docx = require('docx');

const https = require('https');    
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const sizeOf = require('image-size');
const libre = require('libreoffice-convert');
const logger = require('log4js').getLogger('runtime');

const batcher = require('./batcher');

function handleLetterFormatting(job, done) {
    const letter = job.data.letter;
    console.log('start to build for: ' + letter.type + letter.id);
    downloadImage(letter.imageUrl, letter.composedId, function(hasImage) {
        buildDoc(letter, hasImage, function() {
            convertToPdf(letter.composedId, function(path) {
                if(path) {
                    return batcher(path, letter, done);
                } else {
                    done();
                }
            });
        });
    });
}

function downloadImage(url, fileName, callback) {
    if(url) {
        const writePath = path.resolve('images/'+fileName);
        const file = fs.createWriteStream(writePath);
        https.get(url, function(response) {
            if (response.statusCode === 200) {
                var stream = response.pipe(file);
                stream.on('finish', function() {
                    sharp(writePath).resize(600, 350, {
                        fit: sharp.fit.inside
                    }).toFormat('jpg').toFile(writePath + '.jpg', function(err) { 
                        fs.unlink(writePath, () => {});
                        if(err) {
                            logger.error(err);
                            callback(false);
                        } else {
                            callback(true);
                        }
                    })
                })
            } else {
                logger.info("Could not download image at url: " + url);
                file.close();
                fs.unlink(writePath, () => {}); // Delete temp file
                callback(false);
            }
        });
    } else {
        callback(false);
    }
}

function buildDoc(letter, hasImage, callback) {
    const doc = new docx.Document();

    const logoImage = docx.Media.addImage(doc, fs.readFileSync(path.resolve("org_logo.png")), 80, 80);
    const attachedImagePath = path.resolve('images/' + letter.composedId + '.jpg');

    // That's clearly not optimal, but docx was not working when creating children as a list before this
    if(hasImage) {
        const attachedImageFile = fs.readFileSync(attachedImagePath);
        const dimensions = sizeOf(attachedImagePath);
        const attachedImage = docx.Media.addImage(doc, attachedImageFile, dimensions.width, dimensions.height);
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
            logger.error(err);
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
            logger.fatal("PDF MERGING ERROR!");
            logger.error(err);
            callback(undefined);
        } else {
            fs.writeFileSync(outputPath, result);
            callback(outputPath);
        }
    });
}

module.exports = handleLetterFormatting;