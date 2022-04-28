export type ApiResponseErrorType<Error> = {
  success: boolean
  message: string
  error: Error
}