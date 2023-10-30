import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'; //http協定
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment.development";


const BaseUrl: string = environment.API_URL;

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  //--付款------------------------------------------------------------------------------------------------
  postPayment(body: any): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/subscriptions/action-pay`;
    return this.http.post<any>(url, body);
  }

  postRedirect(): Observable<any> {
    const url = `${BaseUrl}/web/v1.0/subscriptions/action-pay/redirect`;
    return this.http.post<any>(url, {});
  }

  postNewebPay(arr: any): Observable<any> {
    const body = new HttpParams()
      .set('MerchantID', arr.MerchantID)
      .set('TradeInfo', arr.TradeInfo)
      .set('TradeSha', arr.TradeSha)
      .set('Version', arr.Version)

    return this.http.post('https://ccore.newebpay.com/MPG/mpg_gateway',
      body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }
    );
  }
}
