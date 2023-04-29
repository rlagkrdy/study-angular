import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitProperty',
})
export class SplitPropertyPipe implements PipeTransform {
  transform(value: any, properties: string): any {
    return properties
      .split('.')
      .reduce((currentValue: any, property: string) => {
        if (!currentValue || !currentValue[property]) {
          return '';
        }
        return currentValue[property];
      }, value);
  }
}
