const fs = require('fs');
const path = require('path');
const pdfMerge = require('pdf-merge');

const Letter = require('../models/letter');
const Batch = require('../models/batch');

const maxBatchSize = 100;

function handleNew(pdfPath, letter) {
    Batch.currentBatchIndex(letter.type, function(currentBatchIndex) {
        console.log(currentBatchIndex);
        if(currentBatchIndex == 0) {
            createNewBatch(pdfPath, letter, 1);
        } else {
            Batch.numberOfLettersInBatch(currentBatchIndex, letter.type, function(batchSize) {
                if(batchSize == maxBatchSize) {
                    createNewBatch(pdfPath, letter, currentBatchIndex+1);
                } else {
                    addInExistingBatch(pdfPath, letter, currentBatchIndex);
                }
            });
        }
    })
}

function createNewBatch(pdfPath, letter, batchIndex) {
    const newBatchFileLocation = `docs/${letter.type}${batchIndex}.pdf`;
    const newBatchFilePath = path.resolve(newBatchFileLocation);

    fs.renameSync(pdfPath, newBatchFilePath);

    Letter.updateOne({ id: letter.id }, { batchIndex: batchIndex }, function(err, result) {

    });

    const batch = new Batch();
    batch.type = letter.type;
    batch.index = batchIndex;
    batch.letterCount = 1;
    batch.downloaded = false;

    batch.save(function(err, result) {

    })
}

function addInExistingBatch(pdfPath, letter, batchIndex) {
    const existingBatchFileLocation = `docs/${letter.type}${batchIndex}.pdf`;
    const existingBatchFilePath = path.resolve(existingBatchFileLocation);

    pdfMerge([existingBatchFilePath, pdfPath]).then(function(buffer) { 
        fs.writeFileSync(existingBatchFilePath, buffer);
        fs.unlinkSync(pdfPath);
    });

    Letter.updateOne({ id: letter.id }, { batchIndex: batchIndex }, function(err, result) {
        
    });

    Batch.updateOne({ index: batchIndex }, { $inc: { letterCount : 1 } }, function(err, raw) {

    });
}

module.exports = handleNew;