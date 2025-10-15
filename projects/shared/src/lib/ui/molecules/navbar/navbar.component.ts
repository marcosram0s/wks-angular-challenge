import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ImageComponent } from '../../atoms';
import { NavLink, NAVBAR_CONSTANTS } from './models/navbar.model';

@Component({
  selector: 'app-navbar',

  imports: [RouterLink, RouterLinkActive, ImageComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent {
  protected readonly constants = NAVBAR_CONSTANTS;

  readonly logoAlt = this.constants.LOGO.ALT;
  readonly routerIndex = this.constants.ROUTER.INDEX;
  readonly widthLogo = this.constants.LOGO.WIDTH;
  readonly heightLogo = Math.round(this.constants.LOGO.WIDTH / this.constants.LOGO.HEIGHT_RATIO);

  links = input.required<NavLink[]>();
  logoPath = input.required<string>();
}
