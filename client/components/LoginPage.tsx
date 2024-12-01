import { Component, ReactNode } from "react";
import { Box, VertBox } from "./Box";
import { Auth0Context, Auth0ContextInterface } from "@auth0/auth0-react";

export default class LoginPage extends Component{
  static contextType = Auth0Context
  context!: Auth0ContextInterface

  render(): ReactNode {
    return <Box className="simple-center view-height login-page">
      <VertBox className='login-box shadow simple-center' gap='20px'>
        <VertBox gap='10px'>
          <h2>Performance Logger</h2>
          <p style={{fontSize: '16px'}} className="tac">Start tracking your performance now</p>
        </VertBox>
        <button className="login-button" onClick={() => this.context.loginWithRedirect()}>Login</button>
      </VertBox>
    </Box>
  }
}