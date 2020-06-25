import JJorm from "../JJorm"

import React = require("react");

export default class DeadModal extends JJorm<Props, State> {
    constructor(props:Props){
        super(props)
        this.state={
        }
    }

  restart=()=>{
      window.location.reload(false)
  }
  render():React.ReactNode {
    return (
      <div id="deadModal" className="modal">

        {this.props.win ? <div><p className="bigger">You win</p> <p>가장 큰 별이 되었습니다.<br/>신기록을 노려보세요.</p></div>
                        :<div><p className="bigger">You Lose</p><p> 별이 먹기에 너무 큽니다. </p></div>}
        {this.props.win && <div>Travel Distance: {this.props.keys}</div>}
        <button onClick={this.restart}>재시작</button>
      </div>
    )
  }
}
