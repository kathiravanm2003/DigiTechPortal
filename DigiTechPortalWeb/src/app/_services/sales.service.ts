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
    flaskAPI?: string;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('user')!));
        this.user = this.userSubject.asObservable();
        this.flaskAPI = 'http://localhost:5000';
    }

    uploadFile(formData: FormData) {
        this.http.post(`${this.flaskAPI}/upload`, formData).subscribe(
            (response) => console.log(response),
            (error) => console.log(error)
        );
    }

    getSales() {
        return this.http.get<SalesModel[]>(`${this.flaskAPI}/getsales`);
    }

    getcleansales() {
        return this.http.get<SalesModel[]>(`${this.flaskAPI}/getcleansales`);
    }

    getsaleshistogram() {
        return this.http.get(`${this.flaskAPI}/getsaleshistogram`, { responseType: 'blob' });
    }

    getsaleslinechart() {
        return this.http.get(`${this.flaskAPI}/getsaleslinechart`, { responseType: 'blob' });
    }

    getsalesprediction(startDate: string, endDate: string) {
        return this.http.get(`${this.flaskAPI}/getsalesprediction`,
            {
                params:
                {
                    'startdate': startDate,
                    'enddate': endDate
                },
                responseType: 'blob'
            });
    }
}