const studyChaos = require('./studyChaos');
const getAttractors = require('./getAttractors');
const filterAttractors = require('./filterAttractors');

const selectAttractors = function(opts){
	return getAttractors(opts).then(({
		attractors,
		isChaos,
		min,
		max
	}) => {
		if(!isChaos){
			return filterAttractors({
				attrRange: opts.attrRange || [0,1],
				attractors: attractors
			}).then(attractors => {
				return {
					attractors: attractors
				}
			})
		} else {
			opts.p = opts.param
			return studyChaos(Object.assign({},  opts, {
				yRange: [0, 1],
				attrRange: opts.attrRange || [min, max]
			}))
		}
	})
}


module.exports = function({
	param,
	fn,
	attrRange,
	firstValue,
	maxIteration,
	precision=0.0001,
	verifAttractors,
	chaosRange=0.1
}){

	return selectAttractors({
		param,
		fn,
		attrRange,
		firstValue,
		maxIteration,
		precision,
		verifAttractors
	});

};
