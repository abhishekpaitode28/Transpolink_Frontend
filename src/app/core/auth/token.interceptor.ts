import { HttpInterceptorFn } from '@angular/common/http';

// TODO: import inject from '@angular/core'
// TODO: import AuthService

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  // TODO: inject AuthService
  // TODO: get the token via auth.getToken()
  // TODO: if token exists, clone the request and add the Authorization header
  //       Header format: `Bearer ${token}`
  // TODO: call next() with the cloned (or original) request

  return next(req); // placeholder
};
