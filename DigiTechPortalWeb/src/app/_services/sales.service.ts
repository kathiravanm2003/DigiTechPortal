import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { SalesModel } from '@app/sales/sales.model';

@Injectable({ providedIn: 'root' })
export class SalesService {
    private userSubject: BehaviorSubject<User | null>;
    public user: Observable<User | null>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
    }

    uploadFile(formData: FormData) {
        this.http.post('http://localhost:5000/upload', formData).subscribe(
            (response) => console.log(response),
            (error) => console.log(error)
        );
    }

    getSales()
    {
        return this.http.get<SalesModel[]>('http://127.0.0.1:5000/getsales');
    }

    getcleansales()
    {
        return this.http.get<SalesModel[]>('http://127.0.0.1:5000/getcleansales');
    }

    getsaleshistogram()
    {
        return this.http.get('http://127.0.0.1:5000/getsaleshistogram', { responseType: 'blob' });
    }

    getsaleslinechart()
    {
        return this.http.get('http://127.0.0.1:5000/getsaleslinechart', { responseType: 'blob' });
    }
}