import { SimplePageHeaderComponent } from './../../../common/simple-page-header/simple-page-header.component';
import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../../designs/ng-zorro.module';

@Component({
  selector: 'app-managment-appointment',
  standalone: true,
  imports: [NgZorroAntdModule, SimplePageHeaderComponent],
  templateUrl: './managment-appointment.component.html',
  styleUrl: './managment-appointment.component.scss',
})
export class ManagmentAppointmentComponent {
  readonly listDataMap = {
    eight: [
      { type: 'warning', content: 'This is warning event.' },
      { type: 'success', content: 'This is usual event.' },
    ],
    ten: [
      { type: 'warning', content: 'This is warning event.' },
      { type: 'success', content: 'This is usual event.' },
      { type: 'error', content: 'This is error event.' },
    ],
    eleven: [
      { type: 'warning', content: 'This is warning event' },
      { type: 'success', content: 'This is very long usual event........' },
      { type: 'error', content: 'This is error event 1.' },
      { type: 'error', content: 'This is error event 2.' },
      { type: 'error', content: 'This is error event 3.' },
      { type: 'error', content: 'This is error event 4.' },
    ],
  };

  getMonthData(date: Date): number | null {
    if (date.getMonth() === 8) {
      return 1394;
    }
    return null;
  }
}
