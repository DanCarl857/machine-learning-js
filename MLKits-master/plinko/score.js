const outputs = [];
const predictionPoint = 300;
const k = 3;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 10;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

  // let numberCorrect = 0;
  // for(let i = 0; i < testSet.length; i++) {
  //   const bucket = kNN(trainingSet, testSet[i][0]);
  //   if (bucket == testSet[i][3]) {
  //     numberCorrect++;
  //   }
  // }

  const accuracy = _.chain(testSet)
    .filter(testPoint => kNN(trainingSet, testPoint[0]) === testPoint[3])
    .size()
    .divide(testSetSize)
    .value();

  console.log('Accuracy is: ', accuracy);
}

function kNN(data, point) {
  return _.chain(data)
    .map(row => [distance(row[0], point), row[3]])
    .sortBy(row => row[0])
    .slice(0,k)
    .countBy(row => row[1])
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  return Math.abs(pointA - pointB);
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}