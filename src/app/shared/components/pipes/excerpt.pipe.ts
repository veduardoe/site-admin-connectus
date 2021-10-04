import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excerpt'
})
export class ExcerptPipe implements PipeTransform {

  transform(value: string, max: number) {
    return value && value.length > max ? value.substr(0,max) + '...' : value;
  }

}
