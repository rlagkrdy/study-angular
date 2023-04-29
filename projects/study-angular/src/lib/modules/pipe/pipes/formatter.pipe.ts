import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatter',
})
export class FormatterPipe implements PipeTransform {
  transform(value: any, formatterFn: (value: any) => string): any {
    if (value === undefined) {
      return '';
    }
    return !formatterFn ? value : formatterFn(value);
  }
}
