import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalComponent, NavbarComponent, ToastComponent } from '@shared/ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ModalComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {}
