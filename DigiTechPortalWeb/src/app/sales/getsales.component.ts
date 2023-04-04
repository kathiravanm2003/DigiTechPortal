import { AfterViewInit, Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import { DomSanitizer } from '@angular/platform-browser';

import { SalesService } from '@app/_services';
import { SalesModel } from './sales.model';

@Component({ templateUrl: 'getsales.component.html' })
export class GetSalesComponent implements OnInit {

    sales?: SalesModel[];
    salesC?: SalesModel[];
    histogramUrl?: any;
    linechartUrl?: any;

    constructor(
        private http: HttpClient,
        private salesService: SalesService,
        private sanitizer: DomSanitizer
    ) {

    }

    ngOnInit() {
        this.salesService.getSales()
            .pipe(first())
            .subscribe(sales => this.sales = sales);

        this.salesService.getcleansales()
            .pipe(first())
            .subscribe(salesC => this.salesC = salesC);

        this.http.get('http://127.0.0.1:5000/getsaleshistogram', { responseType: 'blob' })
            .subscribe((blob: Blob) => {
                this.histogramUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            });

        this.http.get('http://127.0.0.1:5000/getsaleslinechart', { responseType: 'blob' })
            .subscribe((blob: Blob) => {
                this.linechartUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            });
    }

    // ngAfterViewInit() {
    //     // activate tabs with jQuery
    //     $('ul.nav-tabs button').click((e: any) => {
    //         e.preventDefault();
    //         $(e.target).tab('show');
    //     });
    // }
}