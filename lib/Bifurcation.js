const findAttractors = require('./findAttractors');

class Bifurcation {
	/**
	* @constructor
	* @param {function} fn - a function with 2 arguments like (a,x) => { a*x*(1 - x) }
	*/
	constructor({fn, logger}){
		this.fn = fn;
		this.logger = logger;
	}
	/**
	* @typedef {object} attractorsRes
	* @property {Array.<number>} attractors
	* @property {Array.<Array<number>>} chaos
	*/
	/**
	* @param {number|object} opts - if number is given then it is used as opts.param
	* @param {number} [opts.param=opts] - the parameter of the function (first paramter of fn function)
	* @param {number} [precision=1e-6]
	* @param {number} [min=null]
	* @param {number} [max=null]
	* @returns {Promise.<attractorsRes>}
	*/
	attractors(opts){
		let param, min, max;
		if(typeof(opts) === 'number'){
			param = opts;
		} else {
			param = opts.param;
			min = opts.min;
			max = opts.max;
		}

		if(!param){
			return Promise.reject(new Error('no param'))
		}

		const options = {
			param: param,
			sensibility: opts.precision,
			min: opts.min,
			max: opts.max,
			fn: this.fn,
			maxIteration: opts.maxIteration,
			verifAttractors: opts.verifAttractors
		};

		if(min && max){
			options.attrRange = [min,max];
		}


		return findAttractors(options)

	}
}


module.exports = Bifurcation;
