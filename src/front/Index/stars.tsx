import JJorm from "../JJorm"

import React = require("react");

let arr:any[] = [];
for(let k = 0; k<10; k++){
    let i = Math.random()*1670
    let j = Math.random()*780
    let w = Math.random()*10 + 20
    let u = Math.random()*1 + 0.1 + 's'
    arr.push({left: i, bottom: j, width: w, duration: u})
}
for(let k = 10; k<18; k++){
    let i = Math.random()*1670
    let j = Math.random()*780
    let w = Math.random()*20 + 30
    let u = Math.random()*1 + 0.1 + 's'
    arr.push({left: i, bottom: j, width: w, duration: u})
}
for(let k = 18; k<20; k++){
    let i = Math.random()*1670
    let j = Math.random()*780
    let w = Math.random()*10 + 50
    let u = Math.random()*1 + 0.1 + 's'
    arr.push({left: i, bottom: j, width: w, duration: u})
}

for(let k = 20; k<30; k++){
    let i = Math.random()*1670
    let j = Math.random()*780
    let w = Math.random()*10 + 10
    let u = Math.random()*1 + 0.1 + 's'
    arr.push({left: i, bottom: j, width: w, duration: u})
}

export default class Stars extends JJorm {
    
  ACTION_RECEIVER_TABLE:JJWAK.ActionReceiverTable = {
      "ifCollide": (userLeft, userBottom, userWidth)=>{
        console.log("ifCollide")
        arr.map((k)=>{
            let v:number = (k.left - userLeft + k.width/2 - userWidth/2)**2 + (k.bottom - userBottom + k.width/2 - userWidth/2)**2 
            let w:number = (userWidth/2 + k.width/2)**2
            console.log(v,w)
            if( v < w){
                console.log("didCollide");
                if(k.width<=userWidth){
                    console.log("small");
                    JJorm.trigger("eat", k.width);
                    arr.splice(arr.indexOf(k), 1)
                    this.forceUpdate()
                }
                else{
                    console.log("big");
                    JJorm.trigger("die");
                }
            }
        })
      }
  };
  render():React.ReactNode {
    console.log(arr)
    return (
      arr.map((i:any)=>{
        if(i.width === 0){
            arr.splice(arr.indexOf(i), 1)
            return 0
        }else{
            return <div className="star" style={
                {left: i.left, bottom: i.bottom, width: i.width, height: i.width, animationDuration: i.duration, position: 'absolute'
                }}>
                    &nbsp;
                </div>
    }
      })
    )
  }
}