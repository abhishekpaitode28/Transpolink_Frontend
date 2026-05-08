import { Component,inject,signal,OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators, ValueChangeEvent } from "@angular/forms";


import { MatCardModule }            from '@angular/material/card';
import { MatFormFieldModule }       from '@angular/material/form-field';
import { MatInputModule }           from '@angular/material/input';
import { MatButtonModule }          from '@angular/material/button';
import { MatIconModule }            from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule }         from '@angular/material/divider';
import { MatTabsModule }            from '@angular/material/tabs';
import { MatSnackBar }              from '@angular/material/snack-bar';

import { AuthService } from "../../auth/auth.service"; 
import { UserSevice } from '../../services/user.service';
import { roleLabel }   from '../../../../shared/constants/role.constants';



@Component({
  selector: 'tl-profile',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatProgressSpinnerModule,
    MatDividerModule, MatTabsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls:    ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit{
    private fb=inject(FormBuilder);
    private auth=inject(AuthService);
    private users=inject(UserSevice);
    private snackbar=inject(MatSnackBar);

    loadingProfile=signal(false);
    savingprofile=signal(false);
    savingPassword=signal(false);
    loggingOutAll=signal(false);
    confirmLogout=signal(false);

    errorProfile=signal(' ');
    errorPassword=signal(' ');

  userId   = signal('');
  email    = signal('');
  role     = signal('');
  isActive = signal(true);
  showCurrentPassword = signal(false);
  showNewPassword     = signal(false);

  roleLabel=roleLabel;

  profileForm:FormGroup=this.fb.group({
    fullName:['',[Validators.required,Validators.minLength(2),Validators.maxLength(100)]],
    email:['',[Validators.required,Validators.email]],
    phoneNumber:['',[Validators.required,Validators.pattern(/^[+]?[0-9]{10,15}$/)]],
  });

  passwordForm:FormGroup=this.fb.group({
    currentPassword:['',[Validators.required]],
    newPassword:['',[Validators.required,Validators.minLength(8)]],
  });

  ngOnInit(): void {
      this.loadProfile();
  }

  //function for getting the profile data on componenet loading!
private loadProfile():void{
    const me=this.auth.currentUser();
    if(!me){
        this.errorProfile.set('Not logged in!');
        return;
    }
    if (me.role === 'Citizen') {
      this.userId.set(me.id);
      this.email.set(me.email);
      this.role.set(me.role);
      this.isActive.set(me.isActive);
      this.profileForm.patchValue({
        fullName:    me.fullName,
        email:       me.email,
        phoneNumber: me.phone,
      });
      return;
    }

    this.loadingProfile.set(true);
    this.errorProfile.set(' ');

    this.users.getById(me.id).subscribe({
        next:user=>{
            this.loadingProfile.set(false);

            this.userId.set(user.id);
            this.email.set(user.email);
            this.role.set(user.role);
            this.isActive.set(user.isActive);

            //prefillingg the form!,,
            this.profileForm.patchValue({
                fullName:user.fullName,
                email:user.email,
                phoneNumber:user.phone,
            });
        },
        error:err=>{
            this.loadingProfile.set(false);
            this.userId.set(me.id);
            this.email.set(me.email);
            this.role.set(me.role);
            this.isActive.set(me.isActive);
            this.profileForm.patchValue({
                fullName:    me.fullName,
                email:       me.email,
                phoneNumber: me.phone,
            });
            this.errorProfile.set(this.extractError(err,'failed to load profile.'));
        }
    })
}
  private extractError(err: any, fallback: string): string {
    return err?.error?.message
        || err?.error?.title
        || err?.message
        || fallback;
  }

  onUpdateProfile():void{
    if(this.profileForm.invalid){
        this.profileForm.markAllAsTouched();
        return;
    }
    this.savingprofile.set(true);
    this.errorProfile.set(' ');

    this.users.update(this.userId(),this.profileForm.value).subscribe({
        next:user=>{
            this.savingprofile.set(false);
            this.email.set(user.email);
            this.snackbar.open('Profile updated successfully','Close',{duration:3000});
        },
        error:err=>{
            this.savingprofile.set(false);
            this.errorProfile.set(this.extractError(err,'Could not update profile!'));
        }
    });
  }

  onChangePassword():void{
    if(this.passwordForm.invalid){
        this.passwordForm.markAllAsTouched();
        return;
    }

    this.savingPassword.set(true);
    this.errorPassword.set(' ');

    this.users.changePassword(this.userId(),this.passwordForm.value).subscribe({
        next:user=>{
            this.savingPassword.set(false);
            this.passwordForm.reset();
            this.snackbar.open('Password changed successfully!','Open',{duration:3000});
        },
        error:err=>{
            this.savingPassword.set(false);
            this.errorPassword.set(this.extractError(err,'failed to change password!'));
        }
    });
  }

  askLogoutAll():void{
    this.confirmLogout.set(true);
  }
  doLogoutAll():void{
    this.loggingOutAll.set(true);
    this.auth.logoutFromAllDevices().subscribe({
        next:()=>{
            //in the auth service already all redirecting and all handled. si its emty!
        },
        error:err=>{
            this.loggingOutAll.set(false);
            this.confirmLogout.set(false);
            this.snackbar.open(this.extractError(err,'failed to logout from all devices!'),'Close',{duration:4000})
        }
    });
  }

  toggleCurrentPassword():void{
    this.showCurrentPassword.update(v=>!v);
  }
  toggleNewPassword():void{
    this.showNewPassword.update(v=>!v);
  }

}