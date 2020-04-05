// As soon as a letter is approved, we build it.

// import { Document, Paragraph, Media, Packer } from "docx";
const docx = require('docx');

const https = require('https');
const fs = require('fs');
// const sharp = require('sharp');
const path = require('path');

function handleLetterFormatting(letter) {
    // const imageSize = downloadImage(letter.imageUrl, letter.composedId);
    buildDoc(letter, undefined);
}

function downloadImage(url, fileName) {
    const file = fs.createWriteStream(fileName);
    const request = https.get(url, function(response) {
        if (response.statusCode === 200) {
            response.pipe(file);
            sharp(fileName).resize(300,300).max().toFile(fileName, function(err) { 
                if(err) {
                    return undefined;
                } else {
                    return { width: 300, height: 300};
                }
            })
        } else {
            file.close();
            fs.unlink(fileName, () => {}); // Delete temp file
            return undefined;
        }
    });
}

function buildDoc(letter, imageSize) {
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

    const logoImage = docx.Media.addImage(doc, fs.readFileSync(path.resolve("org_logo.png")));

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
                            name: 'Aido'
                        }
                    })]
                }),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.content,
                        font: {
                            name: 'Aido'
                        }
                    })]
                }),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.signature,
                        font: {
                            name: 'Aido'
                        }
                    })]
                }),
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
                new docx.Paragraph(logoImage, 100, 100),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.heading,
                        font: {
                            name: 'Aido'
                        }
                    })]
                }),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.content,
                        font: {
                            name: 'Aido'
                        }
                    })]
                }),
                new docx.Paragraph({
                    children: [new docx.TextRun({
                        text: letter.signature,
                        font: {
                            name: 'Aido'
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
    });
};

function convertToPdf(fileName) {

}

module.exports = handleLetterFormatting;