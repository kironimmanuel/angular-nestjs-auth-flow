import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterLink } from '@angular/router';
import { AppRoute } from '../../../shared/enums';

@Component({
    selector: 'app-layout-footer',
    templateUrl: './footer.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DatePipe, RouterLink, MatDividerModule],
    standalone: true,
})
export class FooterComponent {
    today: number = Date.now();
    privacyRoute = AppRoute.PRIVACY;
    termsOfServiceRoute = AppRoute.TERMS_OF_SERVICE;
}
