import React from "react"
import LogGroup from "../../../models/classes/LogGroup"
import { ReactNode } from "react"

export interface ILogGroupContext {
  /*correctHeightFn: () => void*/
  reload: () => void
  logGroup: LogGroup
}

export const LogGroupContext = React.createContext<ILogGroupContext | undefined>(undefined)

export class LGProvider extends React.Component<ILogGroupContext & {children?: ReactNode}>{
  render(): ReactNode {
    return <LogGroupContext.Provider value={{reload: this.props.reload, logGroup: this.props.logGroup
    }}>
      {this.props.children}
    </LogGroupContext.Provider>
  }
}