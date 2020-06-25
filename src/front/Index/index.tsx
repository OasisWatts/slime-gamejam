import React = require("react");

import JJorm from "../JJorm";
import Bind from "../ReactBootstrap";

import User from "./user";
import Stars from "./stars";
import DeadModal from "./deadModal";
import StoryModal from "./storyModal";
// import {Cookies } from "react-cookie";
// import {instanceOf} from 'prop-types';

export default class Index extends JJorm<JJWAK.Page.Props<'Index'>, State>{
  // static propTypes = {
  //   cookies: instanceOf(Cookies).isRequired
  // }
  constructor(props:JJWAK.Page.Props<"Index">){
    super(props)
    //const {cookies} = props;
    this.state={
      story: true,
      dead: false,
      win: false,
      keys: 0,
      // best: cookies.get('best') || 9999
    }
  }
  ACTION_RECEIVER_TABLE:JJWAK.ActionReceiverTable = {
    "die":()=>{
      this.setState({dead: true, win: false})
    },
    "gameOver":(keys:number)=>{
      // const {cookies} = this.props
      // if(keys<this.state.best){
      //   cookies.set('best', keys,{path:'/'})
      //   this.setState({dead: true, win: true, keys: keys, best: keys})
      // }else{
        this.setState({dead: true, win: true, keys: keys})
      // }
    },
    "play":()=>{
      this.setState({story:false})
    }
  }
  render():React.ReactNode{
    return <article id="background">
      {this.state.dead && <DeadModal win={this.state.win} keys={this.state.keys}/>}
      {this.state.story && <StoryModal/>}
      <User/>
      <Stars/>
    </article>;
  }
}
Bind(Index);