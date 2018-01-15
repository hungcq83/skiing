const fs = require('fs');
const readline = require('readline');
const stream = require('stream');

const instream = fs.createReadStream('map.txt');
const rl = readline.createInterface(instream, null);

const inputArr = [];
const lp = [];

var count = 0;
var width, height;

function findLPForCell(i, j, arr) {
  if (lp[i][j] > 0) return lp[i][j];
  let north,
      south,
      west,
      east;
  north = (i>0 && inputArr[i-1][j] < inputArr[i][j]) ? 1 + findLPForCell(i-1, j, arr) : 1;
  south = (i<width-1 && inputArr[i+1][j] < inputArr[i][j]) ? 1 + findLPForCell(i+1, j, arr) : 1;
  west = (j>0 && inputArr[i][j-1] < inputArr[i][j]) ? 1 + findLPForCell(i, j-1, arr) : 1;
  east = (j<height-1 && inputArr[i][j+1] < inputArr[i][j]) ? 1+ findLPForCell(i, j+1, arr) : 1;

  lp[i][j] = Math.max(north, south, west, east);
  if (lp[i][j] === 1) {
    arr.push(inputArr[i][j]);
  }
  return lp[i][j];
}

function findLongestPath() {
  let max = 0;
  let steepest = 0;
  count = 0;
  for (var i=0; i<width; i++) {
    for (var j=0; j<height; j++) {
      let arr = [];
      let length = findLPForCell(i, j, arr);
      if (length > max) {
        max = length;
      }
      count++;
    }
  }
  return max;
}

function findSteep(i, j, arr) {
  let gotPath = false;
  let currVal = inputArr[i][j];
  if (i>0 && inputArr[i-1][j] < currVal) {
    gotPath = true;
    findSteep(i-1, j, arr);
  }
  if (i<width-1 && inputArr[i+1][j] < currVal) {
    gotPath = true;
    findSteep(i+1, j, arr);
  }
  if (j>0 && inputArr[i][j-1] < currVal) {
    gotPath = true;
    findSteep(i, j-1, arr);
  }
  if (j<height-1 && inputArr[i][j+1] < currVal) {
    gotPath = true;
    findSteep(i, j+1, arr);
  }
  if (!gotPath) {
    arr.push(inputArr[i][j]);
  }

}

function findLPAndSteepestPath(max) {
  let steepest = 0
  for (var i=0; i<width; i++) {
    for (var j=0; j<height; j++) {
      if (lp[i][j] === max) {
        let arr = [];
        findSteep(i, j, arr);
        arr.sort((x, y) => x - y);
        let steep = inputArr[i][j] - arr[0];
        steepest = (steep < steepest) ? steepest : steep;
      }
    }
  }
  return steepest;
}

rl.on('line', function(line) {
  if (count != 0) {
    var lineArr = [];
    var lpLine = [];
    line.split(' ').forEach(x => {
      lineArr.push(Number(x));
      lpLine.push(0);
    });
    inputArr.push(lineArr);
    lp.push(lpLine);
  }
  else {
    let arr = line.split(' ');
    width = arr[0];
    height = arr[1];
  }
  count ++;
});

rl.on('close', function() {
  let longest = findLongestPath();
  let steepest = findLPAndSteepestPath(longest);
  console.log(`longest path = ${longest}`);
  console.log(`steepest = ${steepest}`);
});
