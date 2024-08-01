// src/model/data/aws/index.js

const MemoryDB = require('../memory/memory-db');
const s3Client = require('./s3Client');
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const logger = require('../../../logger');

const data = new MemoryDB();
const metadata = new MemoryDB();

// Write a fragment's metadata to memory db. Returns a Promise
function writeFragment(ownerId, id, fragment) {
  logger.debug(`Writing fragment metadata for ownerId: ${ownerId}, id: ${id}`);
  return metadata
    .put(ownerId, id, fragment)
    .then(() => {
      logger.info(`Successfully wrote fragment metadata for ownerId: ${ownerId}, id: ${id}`);
      return fragment;
    })
    .catch((err) => {
      logger.error({ err, ownerId, id }, 'Error writing fragment metadata');
      throw err;
    });
}

// Read a fragment's metadata from memory db. Returns a Promise
function readFragment(ownerId, id) {
  logger.debug(`Reading fragment metadata for ownerId: ${ownerId}, id: ${id}`);
  return metadata
    .get(ownerId, id)
    .then((fragment) => {
      logger.info(`Successfully read fragment metadata for ownerId: ${ownerId}, id: ${id}`);
      return fragment;
    })
    .catch((err) => {
      logger.error({ err, ownerId, id }, 'Error reading fragment metadata');
      throw err;
    });
}

// Write a fragment's data buffer to S3. Returns a Promise
async function writeFragmentData(ownerId, id, data) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
    Body: data,
  };

  logger.debug(
    `Writing fragment data to S3 for ownerId: ${ownerId}, id: ${id}, bucket: ${params.Bucket}`
  );

  const command = new PutObjectCommand(params);

  try {
    const response = await s3Client.send(command);
    logger.info(`Successfully uploaded data to ${params.Bucket}/${params.Key}`, { response });
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key, stack: err.stack }, 'Error uploading fragment data to S3');
    throw new Error('unable to upload fragment data');
  }
}

// Read a fragment's data from S3 and returns a Buffer. Returns a Promise
const streamToBuffer = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

async function readFragmentData(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  logger.debug(
    `Reading fragment data from S3 for ownerId: ${ownerId}, id: ${id}, bucket: ${params.Bucket}`
  );

  const command = new GetObjectCommand(params);

  try {
    const data = await s3Client.send(command);
    logger.info(`Successfully streamed data from ${params.Bucket}/${params.Key}`);
    return streamToBuffer(data.Body);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error streaming fragment data from S3');
    throw new Error('unable to read fragment data');
  }
}

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
async function listFragments(ownerId, expand = false) {
  logger.debug(`Listing fragments for ownerId: ${ownerId}, expand: ${expand}`);
  try {
    const fragments = await metadata.query(ownerId);

    if (expand || !fragments) {
      logger.info(`Successfully listed expanded fragments for ownerId: ${ownerId}`);
      return fragments;
    }

    logger.info(`Successfully listed fragment ids for ownerId: ${ownerId}`);
    return fragments.map((fragment) => ({
      id: fragment.id,
      ownerId: fragment.ownerId,
      type: fragment.type,
    }));
  } catch (err) {
    logger.error({ err, ownerId }, 'Error listing fragments');
    throw new Error('Error listing fragments');
  }
}

// Delete a fragment's metadata and data from S3 and memory db. Returns a Promise
async function deleteFragment(ownerId, id) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  logger.debug(
    `Deleting fragment data from S3 for ownerId: ${ownerId}, id: ${id}, bucket: ${params.Bucket}`
  );

  const command = new DeleteObjectCommand(params);

  try {
    await s3Client.send(command);
    logger.info(`Successfully deleted data from ${params.Bucket}/${params.Key}`);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error deleting fragment data from S3');
    throw new Error('unable to delete fragment data');
  }

  return Promise.all([
    metadata
      .del(ownerId, id)
      .then(() => logger.info(`Successfully deleted metadata for ownerId: ${ownerId}, id: ${id}`))
      .catch((err) => {
        logger.error({ err, ownerId, id }, 'Error deleting fragment metadata');
        throw err;
      }),
    data
      .del(ownerId, id)
      .then(() => logger.info(`Successfully deleted data for ownerId: ${ownerId}, id: ${id}`))
      .catch((err) => {
        logger.error({ err, ownerId, id }, 'Error deleting fragment data');
        throw err;
      }),
  ]);
}

module.exports = {
  listFragments,
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
};
