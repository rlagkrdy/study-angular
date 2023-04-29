import { BaseEntity } from '../../core/base-entity';


export interface User extends BaseEntity {
  email: string;
  name: string;
  phoneNumber: string;
  isAdmin: boolean;
  lastLoggedInAt?: Date;
}