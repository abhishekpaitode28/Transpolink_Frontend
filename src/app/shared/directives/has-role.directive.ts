import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Directive({
  selector: '[tlHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {
  @Input('tlHasRole') role: string = '';

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private auth: AuthService
  ) {}

  ngOnInit() {
    const user = this.auth.currentUser();
    if (user?.roles.includes(this.role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
