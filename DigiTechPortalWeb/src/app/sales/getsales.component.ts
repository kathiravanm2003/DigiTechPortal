import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { SalesService } from '@app/_services';
import { SalesModel } from './sales.model';

@Component({ templateUrl: 'getsales.component.html' })
export class GetSalesComponent implements OnInit {

    sales?: SalesModel[];

    constructor(private salesService: SalesService) {
        
     }

    ngOnInit() {
        this.salesService.getSales()
            .pipe(first())
            .subscribe(sales => this.sales = sales);
    }
}