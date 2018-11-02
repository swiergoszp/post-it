import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  userAuthenticated = false;
  private authListenerSub: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.userAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userAuthenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authListenerSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
