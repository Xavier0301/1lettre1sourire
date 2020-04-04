// As soon as a letter is approved, we build it.

const docx = require('docx');
const https = require('https');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');

function handleLetterFormatting(letter) {
    const imageSize = downloadImage(letter.imageUrl, letter.composedId);
    buildDoc(letter, imageSize);
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

    const logoImage = Media.addImage(doc, fs.readFileSync(path.resolve("orgLogo.png")));

    var sectionChildren = [
        new Paragraph(logoImage, 100, 100).center(),
        new Paragraph().style('content').createTextRun(letter.greeting).font('Aido'),
        new Paragraph().style('content').createTextRun(letter.content).font('Aido'),
        new Paragraph().style('content').createTextRun(letter.signature).font('Aido')
    ]
    if(imageSize !== undefined) {
        const attachedImage = Media.addImage(doc, fs.readFileSync(path.resolve(letter.composedId)));
        const imagePar = Paragraph(attachedImage, imageSize.width, imageSize.height).center()
        sectionChildren.push(imagePar);
    }

    doc.addSection({
        footers: {
            default: new Footer({
                children: [new Paragraph(letter.composedId)],
            })
        },
        children: sectionChildren
    });

};

function convertToPdf(fileName) {

}

module.exports = handleLetterFormatting;