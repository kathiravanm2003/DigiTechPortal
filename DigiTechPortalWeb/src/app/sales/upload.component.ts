import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AlertService, SalesService } from '@app/_services';

@Component({ templateUrl: 'upload.component.html' })
export class UploadComponent implements OnInit {

    loading = false;
    formData: FormData;

    constructor(
        private salesService: SalesService,
        private alertService: AlertService) {
        this.formData = new FormData();
    }

    ngOnInit() {

    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        this.formData.append('file', file, file.name);
    }

    onSubmit() {
        this.loading = true;
        this.salesService.uploadFile(this.formData).subscribe(
            {
                next: (v: any) => {
                    console.log(v);
                    this.alertService.info(v.message);
                },
                error: (e) => {
                    console.error(e);
                    this.alertService.error(e.error);
                    this.loading = false;
                },
                complete: () => console.info('complete')
            }
        );

        this.loading = false;
    }
}