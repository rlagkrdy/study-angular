import { Injectable } from '@angular/core';
import { UserService } from '../../../../../../src/entities/user/user.service';
import { NgUserDb } from './user.db';

@Injectable({
  providedIn: 'root',
})
export class NgUserService extends UserService {
  constructor(protected override userDb: NgUserDb) {
    super(userDb);
  }
}
