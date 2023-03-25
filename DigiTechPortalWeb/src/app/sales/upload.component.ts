import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'upload.component.html' })
export class UploadComponent implements OnInit {

    constructor(private accountService: AccountService) { }

    ngOnInit() {

    }

    onFileSelected(event: any) {
        const file: File = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file, file.name);
        this.uploadFile(formData);
    }

    uploadFile(formData: FormData) {
        this.http.post('http://localhost:5000/upload', formData).subscribe(
            (response) => console.log(response),
            (error) => console.log(error)
        );
    }
}