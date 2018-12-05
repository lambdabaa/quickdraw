#!/usr/bin/env node

const automl = require('@google-cloud/automl').v1beta1;
const fs = require('fs');

const chunkSize = 100;

async function makePrediction(model, image) {
  try {
    const client = new automl.PredictionServiceClient();
    const prediction = await client.predict({
      name: client.modelPath('coms-w4995', 'us-central1', model),
      payload: {image: {imageBytes: fs.readFileSync(`./images/${image}.jpg`)}},
    });
    if (
      !prediction ||
      !prediction[0] ||
      !prediction[0].payload ||
      !prediction[0].payload[0]
    ) {
      console.error('Empty response!');
      return {image, prediction: '0', score: 100.0};
    }

    const payload = prediction[0].payload[0];
    return {
      image,
      prediction: payload.displayName,
      score: payload.classification.score,
    };
  } catch (error) {
    console.error(error);
    return {image, prediction: '0', score: 100.0};
  }
}

function makeBatchPrediction(model, images) {
  return Promise.all(images.map(makePrediction.bind(null, model)));
}

function sleep(millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

async function main() {
  const model = process.argv[2];
  const images = fs
    .readdirSync('./images')
    .map(image => image.replace('.jpg', ''));
  const positives = [];
  for (let i = 0; i < Math.ceil(images.length / chunkSize); i++) {
    const base = i * chunkSize;
    const chunk = images.slice(base, base + chunkSize);
    console.log(`Evaluating [${base}, ${base + chunkSize}]`);
    const start = new Date();
    const results = await makeBatchPrediction(model, chunk);
    results
      .filter(result => result.prediction === '1')
      .forEach(result => {
        positives.push(result);
        console.log(JSON.stringify(result));
      });
    const duration = new Date() - start;
    // Sleep the rest of 10s (must be at least 7.5s of sleep).
    await sleep(Math.max(6000, 10000 - duration));
  }

  fs.writeFileSync(process.argv[3], JSON.stringify(positives));
}

if (require.main === module) {
  main();
}
