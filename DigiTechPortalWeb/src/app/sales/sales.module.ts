import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { LayoutComponent } from './layout.component';
import { UploadComponent } from './upload.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SalesRoutingModule
    ],
    declarations: [
        LayoutComponent,
        UploadComponent
    ]
})
export class SalesModule { }