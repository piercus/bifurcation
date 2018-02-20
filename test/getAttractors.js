import test from 'ava';

const getAttractors = require('../lib/getAttractors.js');

const testsAttractors = [{
		input : {
			param: 2.9995,
			attrRange: [0,1],
			precision : 0.0001,
			maxIteration: 10000,
			fn: (a,x) => {return a*x*(1-x)}
		},
		output: {
			attractors: [0.6666109999983314]
		}
},{
		input : {
			param: 2.9999995,
			attrRange: [0,1],
			precision : 0.0000001,
			maxIteration: 10000,
			fn: (a,x) => {return a*x*(1-x)}
		},
		output: {
			attractors: [0.6666665999271653]
		}
},{
	input : {
		param: 3.2,
		attrRange: [0,5],
		precision : 0.0000001,
		maxIteration: 10000,
		fn: (a,x) => {return a*x*(1-x)}
	},
	output: {
		attractors: [0.5130445095394672, 0.7994554904667249]
	}
}];


const macro = (t, {input, expected, label}) => {

	return getAttractors(input).then(v => {
		t.is(typeof(v.attractors), typeof(expected.attractors), v.attractors+' vs '+expected.attractors)
		t.is(v.attractors.length, expected.attractors.length, v.attractors.length+' vs '+expected.attractors.length)
		if(v.attractors){
			for(var i = 0; i < v.attractors.length; i++){
				const precision = (input.precision || 0.0001)*2;
				const actual = v.attractors[i];
				const expected2 = expected.attractors[i];
				t.true(Math.abs(actual - expected2) < precision, actual + ' is different than ' + expected2 + ' for precision ' + precision);
			}
		}
	})
}

for (var i = 0; i< testsAttractors.length ; i++){
	const input = testsAttractors[i].input;
	const expected = testsAttractors[i].output;
	const label = 'getAttractors on param ' + input.param;
	test.serial(label, macro, {input, expected, label});
}
