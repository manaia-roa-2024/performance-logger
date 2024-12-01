import React from "react";
import { Box } from "./Box";

export default class Header extends React.Component{
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
            <button className="logout-button">Logout</button>
          </Box>   
        </Box>
        
      </Box>
    )
  }
}
