const detectAttractorsPowers = require('./attractor/detectAttractorsPowers');

module.exports = function({
	param,
	fn,
	attrRange,
	firstValue,
	maxIteration,
	precision,
	verifAttractors
}){

	const min = (attrRange && attrRange[0]) || 0;
	const max = (attrRange && attrRange[1]) || 1;

	const attractors = detectAttractorsPowers({
		fn: fn.bind(null, param),
		maxPower: 20,
		precision: precision,
		verifFactor: 2000000,
		min,
		max
	})
	return Promise.resolve({
		isChaos: attractors.length == 0,
		attractors: attractors.length > 0 ? attractors : null,
		min,
		max
	});
};
