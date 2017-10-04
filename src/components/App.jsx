import React from 'react';
import { Link } from 'react-router';

class App extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <div>
        <nav className='navbar navbar-default navbar-fixed-top'>
          <div className='container-fluid'>
            <div className='navbar-header'>
              <Link className='navbar-brand' to='/'>Test technique StationF</Link>
            </div>
          </div>
        </nav>
        {this.props.children}
        <div className='container'>
          <footer className='footer'>
            &copy; 2017 - jwalle
          </footer>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.any
};

export default App;
