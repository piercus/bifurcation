const studyChaos = require('./studyChaos');

const selectAttractors = function({
	param,
	fn,
	attrRange,
	firstValue,
	maxIteration,
	sensibility,
	verifAttractors,
	chaosRange=0.1
}){
	  !firstValue && (firstValue = Math.random());
	  !maxIteration && (maxIteration=100000);
	  !sensibility && (sensibility = 0.001);
	  !verifAttractors && (verifAttractors = 5);

	  var attractors = null, suite = [firstValue], chaos = false, found = false, l = 1, attractors,t,k,m, p= param, min, max;

	  var next = function(){
			const value = fn(p, suite[l-1]);
			if(!min || value < min){
				min = value;
			}
			if(!max || value > max){
				max = value;
			}
	    suite.push(value);
	    l++;
	  }
	  while (l < maxIteration && !found){

	    nextSuite = fn(p, suite[l-1])
	    for(var j = l; j > 3*l/4; j--){
				//console.log(suite[l-1], j, suite[j], nextSuite, sensibility);

	      if(!found && (Math.abs(suite[j] - nextSuite) < sensibility)){
	        found = true;
	        cycle = l-j;

					// we have found a possible attractor, less run 5 cycles to make sure it is one.
	        for(var t = 0; t < verifAttractors*cycle; t++) next();


	        attractors = suite.slice(l-cycle,l).sort();
					//console.log(suite.slice(-10, -1), nextSuite, l, maxIteration);

	        for(var k = 0; k < attractors.length; k++){
	          if(found && Math.abs(suite[l-1-k] - suite[l-1-k-verifAttractors*cycle])>sensibility/10){
	            found = false;
							attractors = [];
	          }
	        }

	      }
	    }

	    if(!found){
	      next();
	      //console.log(l);
	    }

	  }

	  if(!found){
	    chaos = true;
	    //console.log("chaos",p)
	    //throw new Error("not found in "+maxIteration+" iterations");
	    attractors = suite;

			var selectedAttractors = [];
			for(var i = 0; i < attractors.length; i++){
				if(typeof(attractors[i]) === 'number' && (!attrRange || (attractors[i] < attrRange[1] && attractors[i] > attrRange[0]))){
					selectedAttractors.push(attractors[i]);
				}
			}
			if(attrRange){

				//console.log('neededIter', neededIter);
				let value = fn(p, suite[l-1]);
				let counter = l;
				return studyChaos({
					attrRange,
					yRange : [min, max],
					sensibility,
					fn: fn,
					p: p
				}).then(attractors => {
					return {
						selectedAttractors: attractors,
						chaos: true
					}
				});
				//console.log(selectedAttractors);
			} else {
				return Promise.resolve({
					selectedAttractors: selectedAttractors,
					chaos: true
				});
			}
	  } else {
		  var selectedAttractors = [];
		  for(var i = 0; i < attractors.length; i++){
				if(typeof(attractors[i]) === 'number' && (!attrRange || (attractors[i] < attrRange[1] && attractors[i] > attrRange[0]))){
					selectedAttractors.push(attractors[i]);
				}
			}
			return Promise.resolve(selectedAttractors).then(attractors => {
				return {
					selectedAttractors: attractors,
					chaos: false
				}
			});
		}

}


module.exports = function({
	param,
	fn,
	attrRange,
	firstValue,
	maxIteration,
	sensibility,
	verifAttractors,
	chaosRange=0.1
}){

	return selectAttractors({
		param,
		fn,
		attrRange,
		firstValue,
		maxIteration,
		sensibility,
		verifAttractors,
		chaosRange
	}).then(function({selectedAttractors, chaos}){
		const res = {};

		if(chaos){
			const difference = chaosRange;
	    //throw new Error("chaos");
	    //selectedAttractors = selectedAttractors.slice(-50);
			selectedAttractors.sort();
			const ranges = [];
			const attractors = [];
			let currentRange = [selectedAttractors[0]];
			for (var i = 1; i < selectedAttractors.length; i++){
				if(Math.abs(currentRange[currentRange.length - 1] - selectedAttractors[i]) < difference){
					if(currentRange.length === 1){
						currentRange.push(selectedAttractors[i])
					} else if(currentRange.length === 2){
						currentRange[1] = selectedAttractors[i];
					} else {
						throw( new Error('currentRange should be 1 or 2 items'))
					}
				} else {
					if(currentRange.length === 1){
						attractors.push(currentRange[0]);
						currentRange = [selectedAttractors[i]];
					} else if(currentRange.length === 2){
						ranges.push(currentRange)
						currentRange = [selectedAttractors[i]];
					} else {
						throw( new Error('currentRange should be 1 or 2 items'))
					}
				}
			}
			ranges.push(currentRange);
			res.chaos = ranges;
			if(attractors.length > 0){
				res.attractors = attractors;
			}
	  } else {
			const attractrs = selectedAttractors.sort(function(a,b){return a-b});
			if(attractrs.length > 0){
				res.attractors = attractrs
			}
		}

	  return Promise.resolve(res);
	});




};
