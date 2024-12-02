import React from "react";
import { Box } from "./Box";
import { Auth0Context, Auth0ContextInterface } from "@auth0/auth0-react";

export default class Header extends React.Component{
  static contextType = Auth0Context
  context!: Auth0ContextInterface

  render(){
    return (
      <Box tag='header' className="c-white">
        <div className="sec sec1 fg1 aic">

        </div>
        <Box className="sec sec2 aic">
          <h1>Performance Logger</h1>
        </Box>
        <Box className="sec sec3 fg1">
          <Box className="sec-inner aic">
            <button className="logout-button" onClick={() => this.context.logout()}>Logout</button>
          </Box>   
        </Box>
        
      </Box>
    )
  }
}
