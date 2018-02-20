/**
* @param {Array.<number>} points - array of points
* @param {number} difference or precision accepted to be in the range
* @returns {Array.<Array.<number>>} ranges (range = [start,end] = length-2 array)
*/

module.exports = function({points, difference}){
	if(isNaN(difference)){
		throw(new Error('difference is NaN'))
	}
	//throw new Error("chaos");
	//points = points.slice(-50);
	points = points.sort();
	const ranges = [];
	const attractors = [];
	let currentRange = [points[0]];
	for (var i = 1; i < points.length; i++){
		if(Math.abs(currentRange[currentRange.length - 1] - points[i]) < difference){
			if(currentRange.length === 1){
				currentRange.push(points[i])
			} else if(currentRange.length === 2){
				currentRange[1] = points[i];
			} else {
				throw( new Error('currentRange should be 1 or 2 items'))
			}
		} else {
			if(currentRange.length === 1){
				attractors.push(currentRange[0]);
				currentRange = [points[i]];
			} else if(currentRange.length === 2){
				ranges.push(currentRange)
				currentRange = [points[i]];
			} else {
				throw( new Error('currentRange should be 1 or 2 items'))
			}
		}
	}
	if(currentRange.length !== 2){
		return Promise.reject(new Error('range should be length 2'));
	}
	ranges.push(currentRange);
	res.chaos = ranges;
	if(attractors.length > 0){
		res.attractors = attractors;
	}
	return Promise.resolve(res);
}
