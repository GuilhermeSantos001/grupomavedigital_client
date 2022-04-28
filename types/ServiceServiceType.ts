import { ServiceType } from '@/types/ServiceType';

export type DataService = Pick<ServiceType, 'value'>;
export type DataAssignPerson = { personId: string, serviceId?: string };
export type DataAssignWorkplace = { workplaceId: string, serviceId?: string };

export type ResponseCreateService = {
  data: ServiceType
  update: typeof UpdateService
  assignPerson: typeof AssignPersonService
  assignWorkplace: typeof AssignWorkplaceService
  unassignPerson: typeof UnassignPersonService
  unassignWorkplace: typeof UnassignWorkplaceService
  delete: typeof DeleteService
} | undefined;

declare function CreateService(data: DataService): Promise<ResponseCreateService>;
declare function SetService(data: ResponseCreateService): void;
declare function UpdateService(newData: DataService): Promise<boolean>;
declare function AssignPersonService(dataAssign: DataAssignPerson): Promise<boolean>;
declare function AssignWorkplaceService(dataAssign: DataAssignWorkplace): Promise<boolean>;
declare function UnassignPersonService(): Promise<boolean>;
declare function UnassignWorkplaceService(): Promise<boolean>;
declare function DeleteService(): Promise<boolean>;

declare function UpdateServices(id: string, newData: DataService): Promise<boolean>;
declare function AssignPeopleService(dataAssign: Required<DataAssignPerson>[]): Promise<void>;
declare function AssignWorkplacesService(dataAssign: Required<DataAssignWorkplace>[]): Promise<void>;
declare function UnassignPeopleService(peopleServiceId: string[]): Promise<void>;
declare function UnassignWorkplacesService(workplacesServiceId: string[]): Promise<void>;
declare function DeleteServices(id: string): Promise<boolean>;

export type FunctionCreateServiceTypeof = typeof CreateService;
export type FunctionSetServiceTypeof = typeof SetService;
export type FunctionUpdateServiceTypeof = typeof UpdateService | undefined;
export type FunctionAssignPersonServiceTypeof = typeof AssignPersonService | undefined;
export type FunctionAssignWorkplaceServiceTypeof = typeof AssignWorkplaceService | undefined;
export type FunctionUnassignPersonServiceTypeof = typeof UnassignPersonService | undefined;
export type FunctionUnassignWorkplaceServiceTypeof = typeof UnassignWorkplaceService | undefined;
export type FunctionDeleteServiceTypeof = typeof DeleteService | undefined;

export type FunctionUpdateServicesTypeof = typeof UpdateServices | undefined;
export type FunctionAssignPeopleServiceTypeof = typeof AssignPeopleService | undefined;
export type FunctionAssignWorkplacesServiceTypeof = typeof AssignWorkplacesService | undefined;
export type FunctionUnassignPeopleServiceTypeof = typeof UnassignPeopleService | undefined;
export type FunctionUnassignWorkplacesServiceTypeof = typeof UnassignWorkplacesService | undefined;
export type FunctionDeleteServicesTypeof = typeof DeleteServices | undefined;
export type FunctionNextPageTypeof = (() => void) | undefined;
export type FunctionPreviousPageTypeof = (() => void) | undefined;