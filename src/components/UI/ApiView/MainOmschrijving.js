import React from 'react';

class MainOmschrijving extends React.Component {

  render() {
    return (      
        <p className="pt-2">
            {this.props.omschrijving}
        </p>
    );
  }

}

export default MainOmschrijving;