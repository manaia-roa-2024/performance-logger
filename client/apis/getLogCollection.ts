import LogCollection from "../../models/classes/LogCollection";
import { testData } from "./testData";

export default function getLogCollection(){
  return LogCollection.Instance(testData)
} 