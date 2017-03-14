import React, { Component } from 'react'
import { Link } from 'react-router'

export default class NotFound extends Component {
  render() {
    return (      
    	<center className="notFoundBlock">
    		<div className="notFoundBlock">        	
            	<div >
    	    		<h2 >Erorr: 404</h2>                	
                	<span>
        	    		Page Not Found 
        	    		<Link to='/'> To Main Paig </Link>?  
            		</span>
            	</div>            	
        	</div>    		
    	</center> 
    )
  }
};