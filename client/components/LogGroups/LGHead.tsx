import { Component, ContextType, ReactNode } from "react";
import { Box } from "../Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faMinus, faPen } from "@fortawesome/free-solid-svg-icons";
import NameEditor from "./NameEditor";
import { LogGroupContext } from "./LGContext";

interface Props{
  onClick: () => void,
  open: boolean,
  groupName: string
}

interface State{
  editingName: boolean
}

export default class LGHead extends Component<Props, State>{
static contextType = LogGroupContext
context!: ContextType<typeof LogGroupContext>

  constructor(props: Props){
    super(props)
    this.state = {
      editingName: false
    }
  }

  toggleEditingStatus(editing: boolean){
    this.setState(prev => {
      return {...prev, editingName: editing}
    })
  }

  nameEditorLoseFocus(){
    this.toggleEditingStatus(false)
  }

  render(): ReactNode {

    const penClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>{
      e.stopPropagation()
      this.toggleEditingStatus(true)
    }


    return <Box className="log-group-head cp aic" onClick={this.props.onClick} gap='100px'>
      <Box className="fg1 aic" gap='20px'>
        {!this.state.editingName ?
        <>
          <h4 className='group-title-box'>{this.props.groupName}</h4>
          <div className='simple-center edit-pen' title='Edit name' onClick={penClick}>
            <FontAwesomeIcon icon={faPen} fontSize={'18px'}/>
          </div>
        </>
        :
        <NameEditor onBlur={() => this.nameEditorLoseFocus()} logGroup={this.context.logGroup}/>
        }
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