import { ApiResponseSuccessType } from '@/types/ApiResponseSuccessType'
import { ApiResponseErrorType } from '@/types/ApiResponseErrorType';

export type ApiResponseSuccessOrErrorType<Data, Error> = ApiResponseSuccessType<Data> & ApiResponseErrorType<Error>;