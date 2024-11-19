import { Component, ReactNode } from "react";
import { VertBox } from "../../Box";
import SettingPannel from "./SettingPannel";
import Analytics from "./Analytics";
import Graphs from "./Graphs";

export default class GroupMain extends Component{
  render(): ReactNode {
    return <VertBox tag="section" className="group-main fg1" gap='10'>
      <SettingPannel/>
      <VertBox gap='30px'>
        <Graphs/>
        <Analytics/>
      </VertBox>
      
    </VertBox>
  }
}