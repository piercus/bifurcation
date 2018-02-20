module.exports = function({fn, power}){
	return function(x){
		let res = x;
		for(var i = 0; i < power; i++){
			res = fn(res);
		}
		return res;
	}
}
