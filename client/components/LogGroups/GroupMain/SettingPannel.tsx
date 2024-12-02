import { Component, ReactNode } from "react";
import { Box, VertBox } from "../../Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { GenericPopup } from "../../Popup";
import { LogGroupContext } from "../LGContext";
import MutationComponent from "../../MutationComponent";
import deleteLogGroup from "../../../apis/deleteLogGroup";
import Util from "../../../../Util";

export default class SettingPannel extends Component{
  render(): ReactNode {
    return <Box className="gm-content jse">
      <DeleteGroupButton/>
    </Box>
  }
}

class DeleteGroupButton extends Component{

  static contextType = LogGroupContext

  context!: React.ContextType<typeof LogGroupContext>

  constructor(props: object){
    super(props)
  }

  render(): ReactNode {
    const popupId = 'delete-group-' + this.context.logGroup.id
    const trashClick = () =>{
      const popup = document.getElementById(popupId) as HTMLDialogElement
      popup.showModal()
    }

    const noClick = () =>{
      const popup = document.getElementById(popupId) as HTMLDialogElement
      setTimeout(() => popup.close(), 100)
      //popup.close()
    }

    const mutationFn = async () =>{
      return deleteLogGroup(this.context.logGroup.id, await this.context.getAccessTokenSilently())
    }

    const onSuccess = () =>{
      this.context.deleteExistingGroup()
    }

    const onSettled = () =>{
      const popup = document.getElementById(popupId) as HTMLDialogElement
      popup.close()
    }

    return(
    <>
      <GenericPopup id={'delete-group-' + this.context.logGroup.id} className="shadow">
        <VertBox className="delete-popup shadow">
          <div tabIndex={0} className="simple-center prompt">
            <p>Are you sure you want to delete this group? ({this.context.logGroup.name})</p>
          </div>
            <MutationComponent mutationFn={mutationFn} onSettled={onSettled} onSuccess={onSuccess}>
              {({mutate}) =>{
                return <Box className="prompt-buttons">
                  <div role="button" tabIndex={0} onKeyDown={Util.divButtonHandler} className="fg1 yes simple-center ynb" onClick={() => mutate()}>Yes</div>
                  <div role="button" tabIndex={0} onKeyDown={Util.divButtonHandler} className="fg1 no simple-center ynb" onClick={noClick}>No</div>
                </Box>
              }}
            </MutationComponent>
        </VertBox>
      </GenericPopup>
      <button className="simple-center setting-icon trash-box button-default" title='Delete Group' onClick={trashClick} tabIndex={this.context.tabIndex}>
        <FontAwesomeIcon icon={faTrash}/>
      </button>
    </>)
    
  }
}