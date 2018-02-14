import test from 'ava';

const Bif = require('./index.js');

const testsAttractors = [{
		input : 2.6,
		output: {
			attractors: [0.6153842076600382]
		}
	},{
		input : 3.2,
		output: {
			attractors: [0.5130445095394672, 0.7994554904667249]
		}
	},{
		input : {
			param: 3.2,
			min: 0.55,
			max: 0.6,
			precision: 0.0001
		},
		output: {
		}
	},{
		input : 3.2,
		output: {
			attractors: [0.5130445095493879, 0.7994554904667249]
		}
}];

const testChaos = [{
		input : {
			param: 3.7,
			precision: 0.01
		},
		output: {
			chaos: [
				[0.258990989547609, 0.9236766206909823]
			]
		}
	},{
		input : {
			param: 3.7,
			precision: 0.01,
			min: 0.3,
			max: 0.4
		},
		output: {
			chaos: [[0.3, 0.4]]
		}
	},{
		input : {
			param: 3.7,
			precision: 0.000001,
			min: 0.3999,
			max: 0.4
		},
		output: {
			chaos: [[0.3999, 0.4]]
		}
	},{
		input : {
			param: 3.7,
			precision: 0.0000001,
			min: 0.399999,
			max: 0.4
		},
		output: {
			chaos: [[0.399999, 0.4]]
		}
	},{
		input : {
			param: 3.7,
			precision: 0.00000001,
			min: 0.399999,
			max: 0.4
		},
		output: {
			chaos: [[0.3999999, 0.4]]
		}
}];

const macro = (t, {fn, inverse, input, expected, label}) => {
	const bif = new Bif({
		fn,
		inverse: inverse
	});
	console.time(label)
	return bif.attractors(input).then(v => {
		t.is(typeof(v.attractors), typeof(expected.attractors), v.attractors+' vs '+expected.attractors)
		if(v.attractors){
			for(var i = 0; i < v.attractors.length; i++){
				const precision = (input.precision || 0.0001)*2;
				t.true(Math.abs(v.attractors[i] - expected.attractors[i]) < precision, v.attractors[i] + ' is different than ' + expected.attractors[i] + ' for precision ' + precision);
			}
		}
		if(v.chaos){
			for(var i = 0; i < v.chaos.length; i++){
				//console.log(v.chaos[i], v.chaos, input);
				const precision = (input.precision || 0.0001)*2;
				const rangeStart = v.chaos[i][0];
				const expectedStart =  expected.chaos[i][0];
				const rangeEnd = v.chaos[i][1];
				const expectedEnd =  expected.chaos[i][1];				
				t.true(Math.abs(rangeStart - expectedStart) < precision, rangeStart + ' is different than ' + expectedStart + ' for precision ' + precision);
				t.true(Math.abs(rangeEnd - expectedEnd) < precision, rangeEnd + ' is different than ' + expectedEnd + ' for precision ' + precision);
			}
		}
		console.timeEnd(label)
	})
}

for (var i = 0; i< testsAttractors.length ; i++){
	const input = testsAttractors[i].input;
	const expected = testsAttractors[i].output;
	const fn = (a,x) => {return a*x*(1-x)}
	const label = 'simple attractors with logistic a.x(1-x) ' + i;
	test.serial(label, macro, {fn, input, expected, label});
}


for (var i = 0; i< testChaos.length ; i++){
	const input = testChaos[i].input;
	const expected = testChaos[i].output;
	const label = 'chaos with logistic a.x(1-x) ' + i;
	const fn = (a,x) => {return a*x*(1-x)};
	const inverse = (a,x) => {
		let delta = 1-4*x/a;
		if(delta < 0){
			return [];
		} else {
			const d = Math.sqrt(delta);
			return [(1-d)/2, (1+d)/2];
		}
	}

	test.serial(label, macro, {fn, input, expected, label});
}
