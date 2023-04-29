import { HashMap } from '../../../../../../src/core/types';
import { B4sFormGroup } from './form-group';


export interface B4sGroupValueAccessor {
  formGroup: B4sFormGroup;
  controlTypeMap: HashMap<AbstractControlType>;
}

export type AbstractControlType = 'formGroup' | 'formArray' | 'formControl';

export type FormGroupNameConverter = NameMap[] | string[] | string;

export interface NameMap {
  parent: string;
  child: string;
}
