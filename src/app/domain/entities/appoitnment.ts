import { Service } from './service';
import { Employee } from './employee';
import { Customer } from './customer';

export class Appointment {
  constructor(
    public id: number,
    public serviceId: number,
    public employeeId: number,
    public establishmentId: number,
    public code: string,
    public date: Date,
    public active: boolean,
    public observation: string,
    public creationDate?: Date,
    public updateDate?: Date,
    public employee?: Employee,
    public service?: Service,
    public customer?: Customer
  ) {}
}
