import { AfterViewInit, Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import * as $ from 'jquery';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { SalesService } from '@app/_services';
import { SalesModel } from './sales.model';

@Component({ templateUrl: 'getsales.component.html' })
export class GetSalesComponent implements OnInit {

    sales?: SalesModel[];
    salesC?: SalesModel[];
    histogramUrl?: SafeUrl;
    linechartUrl?: SafeUrl;
    salespredictUrl?: SafeUrl;
    loading = false;

    startDate: Date;
    endDate: Date;

    constructor(
        private salesService: SalesService,
        private sanitizer: DomSanitizer
    ) {
        this.startDate = new Date();
        this.endDate = new Date();
    }

    getAllSalesData() {

        this.loading = true;

        this.salesService.getSales()
            .pipe(first())
            .subscribe(sales => this.sales = sales);

        this.salesService.getcleansales()
            .pipe(first())
            .subscribe(salesC => this.salesC = salesC);

        this.salesService.getsaleshistogram()
            .subscribe((blob: Blob) => {
                this.histogramUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            });

        this.salesService.getsaleslinechart()
            .subscribe((blob: Blob) => {
                this.linechartUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            });

        this.salesService.getsalesprediction(this.startDate.toString(), this.endDate.toString())
            .subscribe((blob: Blob) => {
                this.salespredictUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            });

        this.loading = false;
    }

    ngOnInit() {

    }

    // ngAfterViewInit() {
    //     // activate tabs with jQuery
    //     $('ul.nav-tabs button').click((e: any) => {
    //         e.preventDefault();
    //         $(e.target).tab('show');
    //     });
    // }
}