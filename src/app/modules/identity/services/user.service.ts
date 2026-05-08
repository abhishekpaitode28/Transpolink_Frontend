import { Injectable,inject } from "@angular/core";
import { HttpClient,HttpParams } from "@angular/common/http";
import { Observable,map, pipe } from "rxjs";
import { ApiResponse,PagedResult } from "../../../core/models/api-response.model";
import {
  User,
  CreateUserRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  AssignRoleRequest,
  AuditLog,
} from '../../../core/models/user.model';
import { UserRole } from '../../../shared/constants/role.constants';
import { environment } from "../../../../environments/environment";

@Injectable({providedIn:'root'})
export class UserSevice{
    private base=`${environment.apiBaseUrl}/api/Users`;
    private http=inject(HttpClient);

    getAll(page:number=1,pgSize:number=10):Observable<PagedResult<User>>{
        const params=new HttpParams()
        .set('page',page.toString())
        .set('pgSize',pgSize.toString());

        return this.http.get<ApiResponse<PagedResult<User>>>(`${this.base}/Get-Users`,{params})
        .pipe(map(res=>res.data ?? {
            items:[],
            totalCount:0,
            page,
            pageSize: pgSize
        }));
    }

    // it will be used to fetch user by id and ia accessed by admin!
    getById(id:string):Observable<User>{
        return this.http.get<ApiResponse<User>>(`${this.base}/Get-UserById/${id}`)
        .pipe(map(res=>res.data as User));
    }

    create(payload:CreateUserRequest):Observable<User>{
       return this.http.post<ApiResponse<User>>(`${this.base}/Create-User`,payload).
        pipe(map(res=>res.data as User));
    }


    update(id:string,payload:UpdateProfileRequest):Observable<User>{
        return this.http.put<ApiResponse<User>>(`${this.base}/Update-User/${id}`,payload)
        .pipe(map(res=>res.data as User));
    }
    changePassword(id:string,payload:ChangePasswordRequest):Observable<string>{
        return this.http.put<ApiResponse<User>>(`${this.base}/ChnagePassword/${id}`,payload)
        .pipe(map(res=>res.message));
    }
    assignRole(id:string,role:UserRole):Observable<User>{
        const body:AssignRoleRequest={role};
        return this.http.put<ApiResponse<User>>(`${this.base}/AssignRole/${id}`,body)
        .pipe(map(res=>res.data as User));
    }
    activate(id: string): Observable<string> {
    return this.http
      .post<ApiResponse<object>>(`${this.base}/activate/${id}`, {})
      .pipe(map(res => res.message));
  }
   deactivate(id: string): Observable<string> {
    return this.http
      .post<ApiResponse<string>>(
        `${this.base}/Deactivate-User/${id}`,
        {}
      )
      .pipe(map(res => res.message));
  }
  
  getAuditLogsByUser(id:string,page:number=1,pageSize:number=10):Observable<AuditLog[]>{
    const params=new HttpParams()
    .set('page',page.toString())
    .set('pageSize',pageSize.toString());

    return this.http.get<ApiResponse<AuditLog[]>>(`${this.base}/${id}/audit-logs-by-id`,{params}).pipe(map(res=>res.data?? []));
  }

  getAllAuditLogs(
    page: number = 1,
    pageSize: number = 20
  ): Observable<AuditLog[]> {
    const params = new HttpParams()
      .set('page',     page.toString())
      .set('pageSize', pageSize.toString());

    return this.http
      .get<ApiResponse<AuditLog[]>>(
        `${this.base}/get-all/audit-logs`,
        { params }
      )
      .pipe(map(res => res.data ?? []));
  }





}

