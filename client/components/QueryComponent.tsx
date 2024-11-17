import { QueryFunction, useQuery, UseQueryResult } from "@tanstack/react-query";
import { Component, ReactNode, useRef } from "react";

interface QueryProps{
  queryKey: string[]
  queryFn: QueryFunction
}

function Query(props: QueryProps & {children: (result: UseQueryResult) => ReactNode}) {
  const hasRunOnce = useRef(false)
  const query = useQuery({queryKey: props.queryKey, queryFn: props.queryFn, enabled: !hasRunOnce.current})
  hasRunOnce.current = true
  return props.children(query);
}

export default class QueryComponent<P=object, S=object, SS=object> extends Component<P, S, SS>{

  queryKey: string[]
  queryFn: QueryFunction

  constructor(props: P, queryKey: string[], queryFn: QueryFunction){
    super(props)
    this.queryKey = queryKey
    this.queryFn = queryFn
  }

  render() {
    return <Query queryKey={this.queryKey} queryFn={this.queryFn}>
      {(queryResult: UseQueryResult) => this.renderQuery(queryResult)}
    </Query>
  }

  renderQuery({data, isPending, isError}: UseQueryResult): ReactNode{
    return "Not Implemented"
  }

}

/*
class TestComponent extends QueryComponent{

  renderQuery({data, isPending, isError}: UseQueryResult<LogCollection>){
    console.log(data)
    return <div>QueryYYY</div>
  }
}*/