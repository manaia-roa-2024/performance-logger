import { Component, ReactNode } from "react";
import { Box, VertBox } from "../../Box";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { GenericPopup } from "../../Popup";
import { LogGroupContext } from "../LGContext";
import MutationComponent from "../../MutationComponent";
import { QueryClient } from "@tanstack/react-query";
import deleteLogGroup from "../../../apis/deleteLogGroup";
import LogCollection from "../../../../models/classes/LogCollection";

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
      popup.close()
    }

    const mutationFn = () =>{
      return deleteLogGroup(this.context.logGroup.id!)
    }

    const onSuccess = (result: undefined, queryClient: QueryClient) =>{
      queryClient.setQueryData(['log-collection'], (old: LogCollection) =>{
        old.logGroups = old.logGroups.filter(lg => lg.id != this.context.logGroup.id)
        return LogCollection.Clone(old)
      })
    }

    const onSettled = (result: undefined, queryClient: QueryClient) =>{
      const popup = document.getElementById(popupId) as HTMLDialogElement
      popup.close()
    }

    return(
    <>
      <GenericPopup id={'delete-group-' + this.context.logGroup.id} className="shadow">
        <VertBox className="delete-popup shadow">
          <div className="simple-center prompt">
            <p>Are you sure you want to delete this group?</p>
          </div>
            <MutationComponent mutationFn={mutationFn} onSettled={onSettled} onSuccess={onSuccess}>
              {({mutate}) =>{
                return <Box className="prompt-buttons">
                  <div className="fg1 yes simple-center ynb" onClick={() => mutate()}>Yes</div>
                  <div className="fg1 no simple-center ynb" onClick={noClick}>No</div>
                </Box>
              }}
            </MutationComponent>
        </VertBox>
      </GenericPopup>
      <div className="simple-center setting-icon trash-box" title='Delete Group' onClick={trashClick}>
        <FontAwesomeIcon icon={faTrash}/>
      </div>
    </>)
    
  }
}