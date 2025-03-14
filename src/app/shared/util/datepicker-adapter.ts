/**
 * Angular bootstrap Date adapter
 */
import {Injectable} from '@angular/core';
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {Moment} from 'moment';
import moment from 'moment';

@Injectable()
export class NgbDateMomentAdapter extends NgbDateAdapter<Moment> {
  fromModel(date: Moment): NgbDateStruct {
    if (date != null && moment.isMoment(date) && date.isValid()) {
      return {year: date.year(), month: date.month() + 1, day: date.date()};
    }
    // ! can be removed after https://github.com/ng-bootstrap/ng-bootstrap/issues/1544 is resolved
    // tslint:disable-next-line:no-non-null-assertion
    return null!;
  }

  toModel(date: NgbDateStruct): Moment {
    // ! after null can be removed after https://github.com/ng-bootstrap/ng-bootstrap/issues/1544 is resolved
    // tslint:disable-next-line:no-non-null-assertion
    return date ? moment(date.year + '-' + date.month + '-' + date.day, 'YYYY-MM-DD') : null!;
  }
}
