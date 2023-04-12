import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { SalesService } from '@app/_services';

@Component({ templateUrl: 'upload.component.html' })
export class UploadComponent implements OnInit {

    loading = false;
    formData: FormData;

    constructor(private salesService: SalesService) {
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
                next: (v) => console.log(v),
                error: (e) => console.error(e),
                complete: () => console.info('complete')
            }
        );
        this.loading = false;
    }
}