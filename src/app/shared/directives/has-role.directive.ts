import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';

// TODO: import AuthService

@Directive({
  selector: '[tlHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit {

  // TODO: @Input('tlHasRole') role: string = ''

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    // TODO: inject AuthService here
  ) {}

  ngOnInit(): void {
    // TODO: get the current user from auth.currentUser()
    // TODO: if user has the required role → viewContainer.createEmbeddedView(this.templateRef)
    // TODO: else → viewContainer.clear()
  }
}
