const fn1 = function({
	fn,
	iter,
	value,
	attrRange,
	p
}){
	if(typeof(fn) === 'string'){
		fn = eval(fn);
	}
	
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

const fn2 = function({
	iter,
	value,
	attrRange,
	p
}){
	const fn = (a,x) => {return a*x*(1-x)};
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

module.exports = fn2;