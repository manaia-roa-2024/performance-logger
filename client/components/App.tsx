import '../styles/main.css'
import '../styles/defaults.css'
import '../styles/util.css'
import '../styles/root.css'
import Footer from './Footer.tsx'
import Header from './Header.tsx'
import Main from './Main.tsx'
import { SimpleFormProvider } from './SimpleForm/Form/SimpleFormProvider.tsx'
import React from 'react'

class App extends React.Component{
  render(){

    return (
      <SimpleFormProvider>
        <Header/>
        <Main/>
        <Footer/>
      </SimpleFormProvider>
    )
  }
  
}

export default App
