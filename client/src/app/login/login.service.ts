import { Injectable } from '@angular/core';
import { RestManager, HttpRestManagerOptions } from '../core/rest-manager/rest.manager';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private restManager: RestManager) { }

  public login(body): void {
    const options: HttpRestManagerOptions = {
      responseType: 'arraybuffer'
    };

    this.restManager.post('/api/users/login', body, options).subscribe();
  }
}
