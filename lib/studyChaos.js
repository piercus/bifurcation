const PromiseBlue = require('bluebird');
const studyOneChaos = require('./studyOneChaos');

const studyChaos = function({
	fn,
	iter,
	value,
	attrRange,
	p
}){
	const selectedAttractors = [];
	let counter = 0;
	while(counter < iter){
		counter++;
		value = fn(p, value);
		if((value < attrRange[1]) && (value > attrRange[0])){
			selectedAttractors.push(value);
		}
	}
	return Promise.resolve(selectedAttractors);
}

module.exports = function({
	attrRange,
	yRange,
	fn,
	sensibility,
	p,
	concurrency = 1
}){
	const yTotalRange = yRange[1] - yRange[0];
	const rangeSize = attrRange[1] - attrRange[0];
	const factor = yTotalRange/rangeSize;
	const numberInRange = rangeSize/sensibility;
	const neededIter = numberInRange*factor*10;
	const nArray = 100;
	const iterPerArray = Math.floor(neededIter/nArray);
	console.time('chaos')
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
	.then(function(attractors){
		return attractors.reduce((a,b) => a.concat(b), [])
	})
	.tap(selectedAttractors=>{
		console.timeEnd('chaos')
		console.log('selectedAttractors.length,numberInRange', selectedAttractors.length, numberInRange, neededIter);		
	})
	
};
