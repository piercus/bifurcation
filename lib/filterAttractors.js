module.exports = function({attrRange, attractors}){
	var selectedAttractors = [];
	for(var i = 0; i < attractors.length; i++){
		if(typeof(attractors[i]) === 'number' && (!attrRange || (attractors[i] < attrRange[1] && attractors[i] > attrRange[0]))){
			selectedAttractors.push(attractors[i]);
		}
	}
	return Promise.resolve(selectedAttractors)
}
