export const Helper = {
	countEvailableItems (object) {
		let counter = 0;
		for (let key in object) {
			if (object[key]) {
				counter++;
			}
		}
		return counter;
	},

	handleInputChange (event) {    	
		this.setState({
			[event.target.name]: event.target.value
		});
	},

	nonEmptyInput (value)  {   
		return value.length > 0;    
	},

};