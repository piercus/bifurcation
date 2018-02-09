## Explanation

This project aims to give an efficient implementation of the bifurcation diagram computation

```
npm install bifurcation
```

## Usage

```js
const bif = require('bifurcation');

const bif = new Bif({
	fn: function(a, x){
		return a * x * (1 - x);
	}
});

bif.attractors(2)
.then(values => {
	// values is {attractors: 2}
})

bif.attractors(3.2)
.then(values => {
	// values is {chaos: [[0.2, 0.5]]}
})

bif.attractors({
	value: 3.2,
	min: 0.3,
	max: 0.4,
	precision: 0.0001
})
.then(values => {
	// values is {chaos: [0.2, 0.5]}
})


```
