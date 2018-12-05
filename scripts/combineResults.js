#!/usr/bin/env node

const fs = require('fs');

const labels = [
  'airplane',
  'alarm_clock',
  'ambulance',
  'angel',
  'animal_migration',
  'ant',
  'anvil',
  'apple',
  'arm',
  'asparagus',
  'axe',
  'backpack',
  'banana',
  'bandage',
  'barn',
  'baseball_bat',
  'basket',
  'basketball',
  'bat',
  'bathtub',
  'beach',
  'bear',
  'beard',
  'bed',
  'bee',
  'belt',
  'bench',
  'bicycle',
  'binoculars',
  'bird',
  'baseball',
  'blackberry',
  'blueberry',
  'book',
  'boomerang',
  'bottlecap',
  'bowtie',
  'brain',
  'bread',
  'bridge',
  'broccoli',
  'broom',
  'bucket',
  'bulldozer',
  'bus',
  'bush',
  'butterfly',
  'cactus',
  'cake',
  'calculator',
  'calendar',
  'camel',
  'camera',
  'camouflage',
  'campfire',
  'candle',
  'cannon',
  'canoe',
  'car',
  'carrot',
  'castle',
  'cat',
  'ceiling_fan',
  'cell_phone',
  'cello',
  'chair',
  'chandelier',
  'church',
  'circle',
  'clarinet',
  'clock',
  'cloud',
  'coffee_cup',
  'compass',
  'computer',
  'cookie',
  'cooler',
  'couch',
  'cow',
  'crab',
  'crayon',
  'crocodile',
  'crown',
  'cruise_ship',
  'cup',
  'diamond',
  'dishwasher',
  'diving_board',
  'dog',
  'dolphin',
  'donut',
  'door',
  'dragon',
  'dresser',
  'drill',
  'drums',
  'duck',
  'dumbbell',
  'ear',
  'elbow',
  'elephant',
  'envelope',
  'eraser',
  'eye',
  'eyeglasses',
  'face',
  'fan',
  'feather',
  'fence',
  'finger',
  'fire_hydrant',
  'fireplace',
  'firetruck',
  'fish',
  'flamingo',
  'flashlight',
  'flip_flops',
  'floor_lamp',
  'flower',
  'flying_saucer',
  'foot',
  'fork',
  'frog',
  'frying_pan',
  'garden',
  'garden_hose',
  'giraffe',
  'goatee',
  'golf_club',
  'grapes',
  'grass',
  'guitar',
  'hamburger',
  'hammer',
  'hand',
  'harp',
  'hat',
  'headphones',
  'hedgehog',
  'helicopter',
  'helmet',
  'hexagon',
  'hockey_puck',
  'hockey_stick',
  'horse',
  'hospital',
  'hot_air_balloon',
  'hot_dog',
  'hot_tub',
  'hourglass',
  'house',
  'house_plant',
  'hurricane',
  'ice_cream',
  'jacket',
  'jail',
  'kangaroo',
  'key',
];

function getPredictions() {
  const predictions = {};
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const results = require(`./final/${label}.json`);
    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (!predictions[result.image]) {
        predictions[result.image] = [];
      }
      predictions[result.image].push({
        label,
        score: result.score,
      });
    }
  }

  for (let key in predictions) {
    predictions[key] = predictions[key].sort((a, b) => b.score - a.score);
  }

  return predictions;
}

function printStats(predictions) {
  console.log(`Classifiers: ${labels.length}`);
  let count = 0;
  let count1 = 0;
  const single = {98: 0, 99: 0, 99.5: 0, 99.9: 0};
  const double = {98: 0, 99: 0, 99.5: 0, 99.9: 0};
  const triple = {98: 0, 99: 0, 99.5: 0, 99.9: 0};
  for (let key in predictions) {
    let prediction = predictions[key];
    if (prediction[0].score > 0.98) {
      single[98] += 1;
    }
    if (prediction[0].score > 0.99) {
      single[99] += 1;
    }
    if (prediction[0].score > 0.995) {
      single[99.5] += 1;
    }
    if (prediction[0].score > 0.999) {
      single[99.9] += 1;
    }
    if (predictions[key].length > 1) {
      count += 1;
      if (prediction[1].score > 0.98) {
        double[98] += 1;
      }
      if (prediction[1].score > 0.99) {
        double[99] += 1;
      }
      if (prediction[1].score > 0.995) {
        double[99.5] += 1;
      }
      if (prediction[1].score > 0.999) {
        double[99.9] += 1;
      }
    }
    if (predictions[key].length > 2) {
      count1 += 1;
      if (prediction[2].score > 0.98) {
        triple[98] += 1;
      }
      if (prediction[2].score > 0.99) {
        triple[99] += 1;
      }
      if (prediction[2].score > 0.995) {
        triple[99.5] += 1;
      }
      if (prediction[2].score > 0.999) {
        triple[99.9] += 1;
      }
    }
  }
  console.log(`Doubles: ${count}`);
  console.log(`Triples: ${count1}`);

  const size = Object.keys(predictions).length;
  console.log(`Predictions: ${size} / 112199`);
  const sum = Object.values(predictions)
    .map(values => values[0].score)
    .reduce((a, b) => a + b);
  console.log(`Avg. score: ${sum / size}`);
  console.log(`Single: ${JSON.stringify(single)}`);
  console.log(`Double: ${JSON.stringify(double)}`);
  console.log(`Triple: ${JSON.stringify(triple)}`);
}

function printCsv(predictions) {
  const images = fs
    .readdirSync('./images')
    .map(filename => filename.replace('.jpg', ''));
  console.log('key_id,word');
  images.forEach((image) => {
    if (predictions[image]) {
      console.log(`${image},${predictions[image].map(x => x.label).join(' ')}`);
    } else {
      console.log(`${image},""`);
    }
  });
}

function printExclusions(predictions) {
  let result = [];
  for (let key in predictions) {
    let value = predictions[key];
    if (value[0].score >= 0.999) {
      result.push(key);
      continue;
    }
    /**
    if (value.length > 1 && value[1].score >= 0.995) {
      result.push(key);
      continue;
    }
    */
  }
  //console.log(result.length);
  console.log(JSON.stringify(result));
}

function main() {
  const predictions = getPredictions();
  //printStats(predictions);
  //printCsv(predictions);
  printExclusions(predictions);
}

if (require.main === module) {
  main();
}
