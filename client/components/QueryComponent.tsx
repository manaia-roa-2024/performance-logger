import { QueryFunction, useQuery, UseQueryResult } from "@tanstack/react-query";
import { Component, ReactNode } from "react";
import LogCollection from "../../models/classes/LogCollection";

interface QueryProps{
  queryKey: string[]
  queryFn: QueryFunction
}

function Query(props: QueryProps & {children: (result: UseQueryResult) => ReactNode}) {

  return props.children(useQuery({queryKey: props.queryKey, queryFn: props.queryFn}));
}

export default class QueryComponent extends Component{

  queryKey: string[]
  queryFn: QueryFunction

  constructor(props: object, queryKey: string[], queryFn: QueryFunction){
    super(props)
    this.queryKey = queryKey
    this.queryFn = queryFn
  }

  render() {
    return <Query queryKey={this.queryKey} queryFn={this.queryFn}>
      {this.renderQuery}
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