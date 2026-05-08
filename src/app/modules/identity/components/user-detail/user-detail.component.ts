import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatCardModule }            from '@angular/material/card';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatSelectModule }          from '@angular/material/select';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule }         from '@angular/material/tooltip';
import { MatDividerModule }         from '@angular/material/divider';
import { MatSnackBar }              from '@angular/material/snack-bar';

import { UserSevice } from '../../services/user.service';
import { AuthService } from '../../auth/auth.service'; 
import { User } from '../../../../core/models/user.model';
import {
  roleLabel,
  USER_ROLES,
  USER_ROLE_OPTIONS,
  UserRole,
} from '../../../../shared/constants/role.constants';
import { OneOrMany } from '@angular/forms/signals';

@Component({
selector:'tl-user-details',
 standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, DatePipe,
    MatCardModule, MatFormFieldModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatTooltipModule, MatDividerModule,
  ],
  templateUrl: './user-detail.component.html',
  styleUrls:   ['./user-detail.component.scss'],
})
export class UserDetailComponent implements OnInit{
    private route=inject(ActivatedRoute);
    private router=inject(Router);
    private userService=inject(UserSevice);
    private auth=inject(AuthService);
    private snackbar=inject(MatSnackBar);

    loading=signal(false);
    notFound=signal(false);
    errorMsg=signal(' ');

    user=signal<User | null>(null);
    togglingStatus = signal(false);
    selectedRole=signal<UserRole>('Citizen');
    savingRole     = signal(false);
    isAdmin=computed(()=>this.auth.currentRole()===USER_ROLES.Admin);

    roleChanged=computed(()=>{
        const u=this.user();
        return u!==null && this.selectedRole()!==u.role;
    })

    isSelf=computed(()=>{
        const me=this.auth.currentUser();
        const u=this.user();
        return me!==null && u!==null && me.id===u.id;
    })

    roleLabel  = roleLabel;
    roleOptions = USER_ROLE_OPTIONS;

    ngOnInit(): void {
        this.route.paramMap.subscribe(params=>{
            const id=params.get('id');
            if(!id){
                this.notFound.set(true);
                return;
            }
            this.load(id);
        });
    }

    private load(id:string):void{
        this.loading.set(true);
        this.notFound.set(false);
        this.errorMsg.set('');

        this.userService.getById(id).subscribe({
            next:data=>{
                this.loading.set(false);
                this.user.set(data);
                this.selectedRole.set(data.role);
            },
            error:(err)=> {
                this.loading.set(false);
                this.user.set(null);

                 if (err?.status === 404) {
                this.notFound.set(true);
                } else {
                this.errorMsg.set(err?.error?.message || 'Failed to load user.');
                 }
            },
        })
    }

   onToggleStatus():void{
        const u=this.user();
        if(!u || !this.isAdmin() || this.isSelf()){
            return;
        }
        this.togglingStatus.set(true);

        const obs=u.isActive?this.userService.deactivate(u.id):this.userService.activate(u.id);

        obs.subscribe({
            next:(data)=>{
                this.togglingStatus.set(false);
                this.user.update(curr=>
                    curr? {...curr,isActive:!curr.isActive}:curr
                );
                this.snackbar.open(
          data || (u.isActive ? 'User deactivated.' : 'User activated.'),
          'Close',
          { duration: 3000 }
        );
            },
             error: err => {
        this.togglingStatus.set(false);
        this.snackbar.open(
          err?.error?.message || 'Failed to update status.',
          'Close',
          { duration: 4000 }
        );
        },
        })
    }

    onAssignRole():void{
        const user=this.user();
        if(!user || !this.isAdmin() || this.isSelf()){
            return;
        }
        if(!this.roleChanged()){
            return;
        }
        const newRole=this.selectedRole();
        const oldRole=user.role;

        this.savingRole.set(true);

        this.userService.assignRole(user.id,newRole).subscribe({
            next:u=>{
                this.savingRole.set(false);
                this.user.set(u);
                this.selectedRole.set(u.role);
                this.snackbar.open(`Role updated: ${roleLabel(oldRole)} to ${roleLabel(u.role)}`,'Close',{duration:3000});
            },
            error:err=>{
                this.savingRole.set(false);
                this.selectedRole.set(user.role);
                this.snackbar.open(
          err?.error?.message || 'Failed to update role.',
          'Close',
          { duration: 4000 }
        );
            }
        })
    }

    goBack(): void {
    this.router.navigate(['/users']);
  }

  initials(): string {
    const u = this.user();
    if (!u) return '?';
    const src = u.fullName || u.email || '?';
    return String(src).slice(0, 2).toUpperCase();
  }

  copyId(): void {
    const u = this.user();
    if (!u) return;
    navigator.clipboard.writeText(u.id).then(
      () => this.snackbar.open('User ID copied to clipboard.', 'Close', { duration: 2000 }),
      () => this.snackbar.open('Could not copy to clipboard.', 'Close', { duration: 2000 }),
    );
  }


}