const PromiseBlue = require('bluebird');
const studyOneChaos = require('./studyOneChaos');
const pointsToRanges = require('./pointsToRanges');

module.exports = function({
	attrRange,
	yRange,
	fn,
	precision,
	p,
	concurrency = 1
}){
	const yTotalRange = yRange[1] - yRange[0];
	const rangeSize = attrRange[1] - attrRange[0];
	const factor = yTotalRange/rangeSize;
	const numberInRange = rangeSize/precision;
	const neededIter = numberInRange*factor*10;
	const nArray = 100;
	const iterPerArray = Math.floor(neededIter/nArray);
	//console.time('chaos')
	var makeARandomNumber = function(){
	   return Math.random() * yTotalRange+yRange[0];
	}
	var randoms = Array(nArray).fill(0).map(makeARandomNumber);
	return PromiseBlue.map(randoms, function(r){
		const obj = {
			iter: iterPerArray,
			fn: fn,
			value: r,
			attrRange,
			p
		};
		return studyOneChaos(obj);
	}, {concurrency})
	.then(function(points){
		return points.reduce((a,b) => a.concat(b), [])
	}).then(points => {
		// no attractors and no chaos
		// happens when min/max is in an empty region of the bifurcation diagram
		if(points.length === 0){
			return {}
		}
		return pointsToRanges({points, difference: precision*5})
	})

};
