const powerFn = require('./powerFn');

const detectAttractor = function({
	precision,
	max = 1,
	min = 0,
	fn,
	maxAttractors = 1
}){
	let maxIter = 10000;
	let attractors = [];
	let count = 0;
	for(var i = min; i <= max; i+= precision){
		count++;
		if(i !== 0){
			const y = fn(i);
			if(i-precision/2 <= y && y < i+precision/2){
				attractors.push({
					start: i,
					value: y
				});
			}
		}
	}
	const power = (Math.random()*100000);
	const verifFn = powerFn({fn, power})

	let iter = 0;
	while(iter <= 5 || (attractors.length > maxAttractors && iter < maxIter)){
		iter++;
		const power = (Math.random()*1000);
		const verifFn = powerFn({fn, power})
		attractors = attractors.filter(a => {
			a.value = verifFn(a.value)
			return a.start-precision/2 <= a.value && a.value < a.start+precision/2;
		});
		//console.log(attractors.length)
	}
	if(iter === maxIter){
		throw(new Error('too many iterations'));
	}
	return attractors.map(a => a.value);
}

module.exports = detectAttractor;
