const nonEmptyInput = (value) => {   
	return value.length > 0;    
};

const handleInputChange = function(event)  {    	
	this.setState({
		[event.target.name]: event.target.value
	});
};

export {nonEmptyInput, handleInputChange};