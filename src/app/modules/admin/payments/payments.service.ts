import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class PaymentService {
  constructor(private readonly httpClient: HttpClient) {}
  findAll(): Observable<any> {
    return this.httpClient.get<any>(`@hubsd-api/payments`);
  }

  findOne(id: number): Observable<any> {
    return this.httpClient.get<any>(`@hubsd-api/payments/${id}`);
  }
}
