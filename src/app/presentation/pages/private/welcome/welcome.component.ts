import { finalize } from 'rxjs';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { AppointmentService } from './../../../../data/src/appointment.service';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { SkeletonLoadingComponent } from '../../../common/skeleton-loading/skeleton-loading.component';
import ApexCharts from 'apexcharts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroAntdModule,
    SkeletonLoadingComponent,
  ],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  public loading = signal(false);
  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public services: any[] = [];
  public establishments: any[] = [];
  public appointments: any[] = [];

  ngOnInit(): void {
    this.listServices();
    this.establishmentReportList();
    this.appoinmentReport();
  }

  public listServices() {
    this.loading.set(true);
    this.appointmentService
      .serviceReport()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200 || !resp.data) {
            this.services = [];
            return;
          }
          this.defaultResponse = resp;
          this.services = resp.data || [];
          setTimeout(() => {
            this.updateChart();
          }, 100);
        },
        error: () => (this.services = []),
      });
  }

  updateChart() {
    const chartContainer = document.querySelector('#chart1');
    if (!chartContainer) return;
    if (!this.services || this.services.length === 0) return;

    const colors = [
      '#FF5733',
      '#1E90FF',
      '#28A745',
      '#FFC107',
      '#9B59B6',
      '#E74C3C',
      '#00CED1',
    ];

    const options = {
      chart: {
        type: 'bar',
        height: 450,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 700,
          animateGradually: { enabled: true, delay: 150 },
        },
      },
      title: {
        text: 'Reporte de Servicios',
        align: 'center',
        style: {
          fontSize: '10px',
          color: '#4A5568',
        },
      },
      series: [
        {
          name: 'Número de Servicios',
          data: this.services.map((service) => service.quantity),
        },
      ],
      xaxis: {
        categories: this.services.map((service) => service.name),
        labels: {
          style: { colors: '#4A5568', fontSize: '12px', fontWeight: 500 },
        },
      },
      yaxis: {
        labels: {
          style: { colors: '#4A5568', fontSize: '12px', fontWeight: 500 },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          borderRadius: 5,
        },
      },
      colors: this.services.map((_, index) => colors[index % colors.length]),
      grid: {
        borderColor: '#E2E8F0',
        strokeDashArray: 4,
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val: any) => `${val} citas`,
        },
      },
    };

    const chart1 = new ApexCharts(chartContainer, options);
    chart1.render();
  }

  public establishmentReportList() {
    this.loading.set(true);
    this.appointmentService
      .establishmentReport()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          this.establishments = this.defaultResponse.data;
          setTimeout(() => {
            this.updateChart2();
          }, 100);
        },
        error: () => (this.establishments = []),
      });
  }

  updateChart2() {
    const chartContainer = document.querySelector('#chart2');
    if (!chartContainer) return;
    if (!this.establishments || this.establishments.length === 0) return;

    const colors = [
      '#00CED1',
      '#1E90FF',
      '#FF5733',
      '#28A745',
      '#FFC107',
      '#9B59B6',
      '#E74C3C',
    ];

    const options = {
      chart: {
        type: 'bar',
        height: 450,
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 700,
          animateGradually: { enabled: true, delay: 150 },
        },
      },
      title: {
        text: 'Reporte de Establecimientos',
        align: 'center',
        style: {
          fontSize: '10px',
          color: '#4A5568',
        },
      },
      series: [
        {
          name: 'Número de Citas por Establecimiento',
          data: this.establishments.map((e) => e.quantity),
        },
      ],
      xaxis: {
        categories: this.establishments.map((e) => e.name),
        labels: {
          style: { colors: '#4A5568', fontSize: '12px', fontWeight: 500 },
        },
      },
      yaxis: {
        labels: {
          style: { colors: '#4A5568', fontSize: '12px', fontWeight: 500 },
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '45%',
          borderRadius: 5,
        },
      },
      colors: this.establishments.map(
        (_, index) => colors[index % colors.length]
      ),
      grid: {
        borderColor: '#E2E8F0',
        strokeDashArray: 4,
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val: any) => `${val} citas`,
        },
      },
    };

    const chart2 = new ApexCharts(chartContainer, options);
    chart2.render();
  }

  public appoinmentReport() {
    this.loading.set(true);
    this.appointmentService
      .appoinmentReport()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          this.appointments = this.defaultResponse.data;
        },
        error: () => (this.appointments = []),
      });
  }
}
