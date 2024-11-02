import { useState } from "react";

export default function useReload()
{
  const reloadState = useState({})

  return function(){
    reloadState[1]({})
  }
}