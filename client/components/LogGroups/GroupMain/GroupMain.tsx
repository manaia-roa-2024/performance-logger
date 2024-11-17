import { Component, ReactNode } from "react";
import { VertBox } from "../../Box";
import SettingPannel from "./SettingPannel";
import Analytics from "./Analytics";

export default class GroupMain extends Component{
  render(): ReactNode {
    return <VertBox tag="section" className="group-main fg1">
      <SettingPannel/>
      <Analytics/>
    </VertBox>
  }
}