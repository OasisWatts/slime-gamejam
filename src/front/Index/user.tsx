import JJorm from "../JJorm"

import React = require("react");

export default class User extends JJorm<Props, State> {
    constructor(props:Props){
        super(props)
        this.state={
            leftPos: 0,
            bottomPos: 20,
            widthPos: 20, //지름
            keys: 0
        }
    }
  ACTION_RECEIVER_TABLE:JJWAK.ActionReceiverTable = {
      "eat": (starWidth:number)=>{
        const {widthPos, keys} = this.state
        console.log("eat")
        if(widthPos>60){
            console.log("gameOver go trigger")
            JJorm.trigger("gameOver", keys)
        }else{
            this.setState({widthPos: (widthPos**2 + starWidth**2)**(1/2)})
        }
      }
  };

  componentDidMount(){
      super.componentDidMount()
      document.addEventListener("keydown", this.handleKeyDown)
  }
  componentWillUnmount(){
      super.componentWillUnmount()
      document.removeEventListener("keydown", this.handleKeyDown)
  }
  ifCollide = () => {
    const {leftPos, bottomPos, widthPos} = this.state
    console.log("this.ifcollide")
    JJorm.trigger("ifCollide", leftPos , bottomPos, widthPos)
  }
  handleKeyDown = (e:any) => {
      const {leftPos, bottomPos, keys} = this.state
      console.log('keyDown:', e.keyCode)
      switch( e.keyCode ){
          
          case 39: case 68: //right d
            if(leftPos<1670){
                this.setState({leftPos: leftPos+ 20, keys: keys + 1},()=>{this.ifCollide()})
            }
            break
          case 37: case 65://left a
            if(leftPos>0){
                this.setState({leftPos: leftPos- 20, keys: keys + 1},()=>{this.ifCollide()})
            }
             break
          case 38: case 87://up w
            if(bottomPos<790){
                this.setState({bottomPos: bottomPos+ 20, keys: keys + 1},()=>{this.ifCollide()})
            }
             break
          case 40: case 83://down s
            if(bottomPos>10){
                this.setState({bottomPos: bottomPos- 20, keys: keys + 1},()=>{this.ifCollide()})
            }
             break
      }
  }

  render():React.ReactNode {
    const {leftPos, bottomPos, widthPos} = this.state
    let gg = Math.random()
    console.log("reRender", gg)
    let left = leftPos + 'px'
    let bottom = bottomPos + 'px'
    console.log(leftPos, bottomPos, widthPos)
    let width = widthPos + 'px'
    let height = widthPos + 'px'
    return (
      <div id="user" style={{left, bottom, position:'absolute', width, height}}>
        &nbsp;
      </div>
    )
  }
}