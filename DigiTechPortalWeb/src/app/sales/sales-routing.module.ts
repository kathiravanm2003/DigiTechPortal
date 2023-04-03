import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetSalesComponent } from './getsales.component';

import { LayoutComponent } from './layout.component';
import { UploadComponent } from './upload.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: '', component: UploadComponent },
            { path: 'getsales', component: GetSalesComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SalesRoutingModule { }