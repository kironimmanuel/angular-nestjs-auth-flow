import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'dateTimeFormat',
    standalone: true,
})
export class DateTimeFormatPipe implements PipeTransform {
    transform(value: moment.MomentInput, format: string): string {
        if (!value) {
            return '';
        }
        return moment(value).format(format);
    }
}
