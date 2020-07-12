import React from "react";
import BeatLoader from "react-spinners/BeatLoader";
 

 
export class Spinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
 
  render() {
    return (
      <div className="sweet-loading">
        <BeatLoader
          size={20}
          color={"#123abc"}
          loading={this.state.loading}
        />
      </div>
    );
  }
}