import JJorm from "../JJorm"

import React = require("react");

export default class DeadModal extends JJorm<Props, State> {
    constructor(props:Props){
        super(props)
        this.state={
            next: 0
        }
    }
  play=()=>{
      if(this.state.next===2){
        JJorm.trigger("play")
      }else if(this.state.next===1){
          this.setState({next: 2})
      }else if(this.state.next===0){
          this.setState({next: 1})
      }
  }
  render():React.ReactNode {
    return (
      <div id="storyModal" className="modal">
        {!this.state.next && <p>
            지구에 한 슬라임이 살고 있었다.<br/> 가장 커다란 생명체가 되겠다는 원대한 꿈을 갖고, <br/> 자신의 몸보다 큰 물질을 모두 먹는다.
        </p>}
        {this.state.next===1 && <p>
            먹는 만큼 커져, 결국 지구를 전부 삼켜버렸다. 
        </p>}
        {this.state.next===2 && <p>
            슬라임은 우주 진출을 통해, <br/> 자신의 원대한 꿈을 실현시키고자 한다.
        </p>}
        <button onClick={this.play}> {this.state.next ? "시작하기" : "다음"}</button>
      </div>
    )
  }
}
