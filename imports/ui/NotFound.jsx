import React, { Component } from 'react'
import { Link } from 'react-router'

export default class NotFound extends Component {
  render() {
    return (      
      <div className='col-md-12'>
        Page Not Found <Link to='/'>To mani Page</Link>?         
      </div>
      )
  }
};