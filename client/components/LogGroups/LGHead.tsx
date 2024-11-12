import { Component, ReactNode } from "react";
import { Box } from "../Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faMinus, faPen } from "@fortawesome/free-solid-svg-icons";

interface Props{
  onClick: () => void,
  open: boolean,
  groupName: string
}

interface State{
  editingName: boolean
}

export default class LGHead extends Component<Props, State>{
  constructor(props: Props){
    super(props)
    this.state = {
      editingName: true
    }
  }

  render(): ReactNode {

    const penClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>{
      e.stopPropagation()
    }


    return <Box className="log-group-head cp aic" onClick={this.props.onClick}>
    <Box className="fg1 aic" gap='20px'>

      <h4 className="">{this.props.groupName}</h4>
      <div className='simple-center edit-pen' title='Edit name' onClick={penClick}>
        <FontAwesomeIcon icon={faPen} fontSize={'18px'}/>
      </div>

    </Box>
    
    {this.props.open ? <Minus /> : <Expand />}
  </Box>
  }
}

function Expand() {
  return <FontAwesomeIcon icon={faExpand} fontSize="25px" />
}

function Minus() {
  return <FontAwesomeIcon icon={faMinus} fontSize="25px" />
}