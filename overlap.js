#!/usr/bin/env node

const fs = require('fs');

// P(A and B | A or B)
function getOverlap(a, b) {
  let overlap = 0;
  a.forEach((x) => {
    if (b.has(x)) {
      overlap += 1;
    }
  });
  return overlap / (a.size + b.size - overlap);
}

function main() {
  const labels = fs.readdirSync('./final')
    .filter((result) => result.endsWith('.json'))
    .map((result) => result.replace('.json', ''));
  const labelToImages = {};
  labels.forEach((label) => {
    const result = require(`./final/${label}.json`);
    labelToImages[label] = new Set(result.map((record) => record.image));
  });

  let overlaps = [];
  labels.forEach((label) => {
    labels.forEach((other) => {
      if (label >= other) {
        return;
      }

      overlaps.push({
        probability: getOverlap(labelToImages[label], labelToImages[other]),
        labels: [label, other],
      });
    });
  });

  overlaps = overlaps.sort((a, b) => b.probability - a.probability);
  for (let i = 0; i < 100; i++) {
    console.log(overlaps[i]);
  }
}

if (require.main === module) {
  main();
}
