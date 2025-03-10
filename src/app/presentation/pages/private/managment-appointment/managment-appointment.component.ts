import { AppointmentService } from './../../../../data/src/appointment.service';
import { DefaultResponse } from './../../../../domain/common/default-response';
import { SimplePageHeaderComponent } from './../../../common/simple-page-header/simple-page-header.component';
import { Component, inject, signal, OnInit } from '@angular/core';
import { NgZorroAntdModule } from '../../../../designs/ng-zorro.module';
import { Appointment } from '../../../../domain/entities/appoitnment';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-managment-appointment',
  standalone: true,
  imports: [NgZorroAntdModule, SimplePageHeaderComponent, CommonModule],
  templateUrl: './managment-appointment.component.html',
  styleUrl: './managment-appointment.component.scss',
})
export class ManagmentAppointmentComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private defaultResponse: DefaultResponse = new DefaultResponse(200, '');

  public loading = signal(false);
  public appointments: Appointment[] = [];
  public listDataMap: Record<
    string,
    { appointment: Appointment; color: string; content: string }[]
  > = {};
  public selectedAppointment: Appointment | null = null;
  public openModal = false;

  ngOnInit() {
    this.list();
  }

  public list() {
    this.loading.set(true);
    this.appointmentService
      .list()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          this.appointments = this.defaultResponse.data;
          this.processAppointments();
        },
        error: () => (this.appointments = []),
      });
  }

  private processAppointments() {
    this.listDataMap = {};
    this.appointments.forEach((appointment) => {
      const date = new Date(appointment.date);
      const dayKey = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()}`;

      if (!this.listDataMap[dayKey]) {
        this.listDataMap[dayKey] = [];
      }

      this.listDataMap[dayKey].push({
        appointment,
        color:
          appointment.state === 'P'
            ? '#F1EF99'
            : appointment.state === 'D'
            ? '#FF8A8A'
            : '#C5EBAA',
        content: `Cita con ${
          appointment.customer?.person?.firstName +
          ' ' +
          appointment.customer?.person?.lastName
        } a las ${date.toLocaleTimeString()}`,
      });
    });
  }

  public updateState(state: string, code: string) {
    this.loading.set(true);
    const appointment = new Appointment(
      0,
      0,
      0,
      0,
      code,
      new Date(),
      true,
      '',
      state
    );
    this.appointmentService
      .updateState(appointment)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
        },
      });
  }

  public openModalDialog(appointment: Appointment) {
    this.selectedAppointment = appointment;
    this.openModal = true;
  }

  public close() {
    this.selectedAppointment = null;
    this.openModal = false;
  }

  acceptAppointment(): void {
    this.updateState('A', this.selectedAppointment?.code ?? '');
    this.updateAppointmentState(this.selectedAppointment?.code ?? '', 'A');

    this.close();
  }

  rejectAppointment(): void {
    this.updateState('D', this.selectedAppointment?.code ?? '');
    this.updateAppointmentState(this.selectedAppointment?.code ?? '', 'D');
    this.close();
  }

  private updateAppointmentState(
    appointmentCode: string,
    newState: string
  ): void {
    const appointment = this.appointments.find(
      (app) => app.code === appointmentCode
    );
    if (appointment) {
      appointment.state = newState;
      this.processAppointments();
    }
  }
}
