export default class ProblemDetails{
  statusCode: number
  message: string
  errors: Record<string, Array<string>>
  constructor(status=400){
    this.statusCode = status
    this.message = 'One or more errors has occured'
    this.errors = {}
  }

  static PropertyError(propertyName: string, msg: string){
    const pd = new ProblemDetails()
    pd.message = 'There was a problem with one or more properties'
    pd.errors[propertyName] = [msg]
    return pd
  }

  static PermissionError(){
    const pd = new ProblemDetails(403)
    pd.message = 'You do not have permission to perform this action'
    pd.errors.global = [pd.message]
    return pd
  }

  static NullError(entityName: string){
    const pd = new ProblemDetails(404)
    pd.message = `This ${entityName} does not exist`
    pd.errors.global = [pd.message]
    return pd
  }

  static UnknownError(){
    const pd = new ProblemDetails(500)
    pd.message = 'An unexpected error has occured'
    pd.errors.global = [pd.message]
    return pd
  }
}