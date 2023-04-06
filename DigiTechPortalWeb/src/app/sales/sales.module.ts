import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { LayoutComponent } from './layout.component';
import { UploadComponent } from './upload.component';
import { GetSalesComponent } from './getsales.component';

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        SalesRoutingModule
    ],
    declarations: [
        LayoutComponent,
        UploadComponent,
        GetSalesComponent
    ]
})
export class SalesModule { }