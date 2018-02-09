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
			chaos: [[0.258990989547609, 0.9236766206909823]]
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
			precision: 0.0001,
			min: 0.3999,
			max: 0.4
		},
		output: {
			chaos: [[0.3999, 0.4]]
		}
}];

const macro = (t, {fn, input, expected, label}) => {
	const bif = new Bif({fn});
	const startDate = new Date();
	return bif.attractors(input).then(v => {
		t.is(typeof(v.attractors), typeof(expected.attractors), v.attractors+' vs '+expected.attractors)
		if(v.attractors){
			for(var i = 0; i < v.attractors.length; i++){
				t.true(Math.abs(v.attractors[i] - expected.attractors[i]) < (input.precision || 0.0001), v.attractors[i] + ' is different than ' + expected.attractors[i]);
			}
		}
		if(v.chaos){
			for(var i = 0; i < v.chaos.length; i++){
				t.true(Math.abs(v.chaos[i][0] - expected.chaos[i][0]) < (input.precision || 0.0001), v.chaos[i][0] + ' is different than ' + expected.chaos[i][0]);
				t.true(Math.abs(v.chaos[i][1] - expected.chaos[i][1]) < (input.precision || 0.0001), v.chaos[i][1] + ' is different than ' + expected.chaos[i][1]);
			}
		}
		const endDate = new Date();
		console.log(label + ' : ' + ((endDate.getTime() - startDate.getTime())/1000) + ' sec');
	})
}

/*for (var i = 0; i< testsAttractors.length ; i++){
	const input = testsAttractors[i].input;
	const expected = testsAttractors[i].output;
	const fn = (a,x) => {return a*x*(1-x)}
	const label = 'simple attractors with logistic a.x(1-x) ' + i;
	test.serial(label, macro, {fn, input, expected, label});
}*/


for (var i = 0; i< testChaos.length ; i++){
	const input = testChaos[i].input;
	const expected = testChaos[i].output;
	const label = 'chaos with logistic a.x(1-x) ' + i;
	const fn = (a,x) => {return a*x*(1-x)}

	test.serial(label, macro, {fn, input, expected, label});
}
