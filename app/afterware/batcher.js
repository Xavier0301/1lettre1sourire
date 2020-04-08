const fs = require('fs');
const path = require('path');
const pdfMerge = require('pdf-merge');
const logger = require('log4js').getLogger('runtime');

const Letter = require('../models/letter');
const Batch = require('../models/batch');

const maxBatchSize = 100;

function handleNew(pdfPath, letter, callback) {
    Batch.currentBatchIndex(letter.type, function(currentBatchIndex) {
        if(currentBatchIndex == 0) {
            createNewBatch(pdfPath, letter, 1, callback);
        } else {
            Batch.numberOfLettersInBatch(currentBatchIndex, letter.type, function(batchSize) {
                if(batchSize === maxBatchSize) {
                    createNewBatch(pdfPath, letter, currentBatchIndex+1, callback);
                } else {
                    addInExistingBatch(pdfPath, letter, currentBatchIndex, callback);
                }
            });
        }
    })
}

function createNewBatch(pdfPath, letter, batchIndex, callback) {
    const newBatchFileLocation = `docs/${letter.type}${batchIndex}.pdf`;
    const newBatchFilePath = path.resolve(newBatchFileLocation);

    fs.renameSync(pdfPath, newBatchFilePath);

    Letter.model.updateOne({ id: letter.id }, { batchIndex: batchIndex }, function(err, result) {
        if(err) {
            logger.error(err);
        }
    });

    const batch = new Batch();
    batch.type = letter.type;
    batch.index = batchIndex;
    batch.letterCount = 1;
    batch.downloaded = false;

    batch.save(function(err, result) {
        if(err) {
            logger.error(err);
        } 
        callback();
    })
}

function addInExistingBatch(pdfPath, letter, batchIndex, callback) {
    const existingBatchFileLocation = `docs/${letter.type}${batchIndex}.pdf`;
    const existingBatchFilePath = path.resolve(existingBatchFileLocation);

    pdfMerge([existingBatchFilePath, pdfPath]).then(function(buffer) { 
        fs.writeFileSync(existingBatchFilePath, buffer);
        fs.unlinkSync(pdfPath);
    });

    Letter.model.updateOne({ id: letter.id }, { batchIndex: batchIndex }, function(err, result) {
        if(err) {
            logger.error(err);
        }
    });

    Batch.updateOne({ index: batchIndex , type: letter.type }, { $inc: { letterCount : 1 }, downloaded : false }, function(err, raw) {
        if(err) {
            logger.error(err);
        } 
        callback();
    });
}

module.exports = handleNew;