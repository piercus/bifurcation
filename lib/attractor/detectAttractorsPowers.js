const detectAttractor = require('./detectAttractor');
const powerFn = require('./powerFn');
module.exports = function({
	maxPower = 20,
	fn,
	precision,
	min,
	max,
	verifFactor=null
}){
	let currentPower = 1;
	let attractors = [];
	while(attractors.length == 0 && currentPower < maxPower){
		attractors = detectAttractor({
			fn: powerFn({fn, power:currentPower}),
			precision,
			min,
			max,
			maxAttractors: currentPower
		});
		
		if(attractors.length == 0){
			currentPower++;
		}
	}
	return attractors;
}
