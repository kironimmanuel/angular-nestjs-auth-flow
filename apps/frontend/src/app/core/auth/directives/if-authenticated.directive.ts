import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
    selector: '[ifAuthenticated]',
    standalone: true,
})
export class IfAuthenticatedDirective implements OnInit {
    @Input() ifAuthenticated: boolean;

    constructor(
        private authService: AuthService,
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef
    ) {}

    ngOnInit() {
        this.authService.isAuthenticated.subscribe((isAuthenticated) => {
            if ((isAuthenticated && this.ifAuthenticated) || (!isAuthenticated && !this.ifAuthenticated)) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            } else {
                this.viewContainerRef.clear();
            }
        });
    }
}
