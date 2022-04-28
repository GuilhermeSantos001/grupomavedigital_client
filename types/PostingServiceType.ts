import type { PostingType } from '@/types/PostingType';

export type DataPosting = Pick<PostingType,
  | 'author'
  | 'costCenterId'
  | 'periodStart'
  | 'periodEnd'
  | 'originDate'
  | 'description'
  | 'coveringId'
  | 'coverageId'
  | 'coveringWorkplaceId'
  | 'coverageWorkplaceId'
  | 'paymentMethod'
  | 'paymentValue'
  | 'paymentDatePayable'
  | 'paymentStatus'
  | 'paymentDatePaid'
  | 'paymentDateCancelled'
  | 'foremanApproval'
  | 'managerApproval'
  | 'status'
>;

export type ResponseCreatePosting = {
  data: PostingType
  update: typeof UpdatePosting
  delete: typeof DeletePosting
} | undefined

declare function CreatePosting(data: DataPosting): Promise<ResponseCreatePosting>
declare function SetPosting(data: ResponseCreatePosting): void
declare function UpdatePosting(newData: DataPosting): Promise<boolean>
declare function DeletePosting(): Promise<boolean>

declare function UpdatePostings(id: string, newData: DataPosting): Promise<boolean>
declare function DeletePostings(id: string): Promise<boolean>

export type FunctionCreatePostingTypeof = typeof CreatePosting;
export type FunctionSetPostingTypeof = typeof SetPosting;
export type FunctionUpdatePostingTypeof = typeof UpdatePosting | undefined;
export type FunctionDeletePostingTypeof = typeof DeletePosting | undefined;

export type FunctionUpdatePostingsTypeof = typeof UpdatePostings | undefined;
export type FunctionDeletePostingsTypeof = typeof DeletePostings | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;