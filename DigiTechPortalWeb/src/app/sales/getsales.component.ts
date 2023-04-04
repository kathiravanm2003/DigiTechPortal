import { AfterViewInit, Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
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

        this.salesService.getsaleshistogram()
            .subscribe((blob: Blob) => {
                this.histogramUrl = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            });

        this.salesService.getsaleslinechart()
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