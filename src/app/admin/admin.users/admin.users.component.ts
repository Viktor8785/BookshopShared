import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserOrderModel } from 'src/app/users/model/user.order.model';
import { UserModel } from 'src/app/users/model/user.model';
import { UserAdminModel } from 'src/app/admin/user.admin.model';
import { DatabaseService } from 'src/app/shared/database.service';
import { Subscription, from, mergeMap, finalize, take } from 'rxjs';
import { EmitService } from 'src/app/shared/emit.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin.users.component.html',
  styleUrls: ['./admin.users.component.css']
})
export class AdminUsersComponent implements OnInit {
  private subscr!: Subscription;
  private subscr2!: Subscription;
  private subscr3!: Subscription;
  private userId!: string;
  public usersAdmin: UserAdminModel[] = [];
  public isMouseOver = -1;
  public searchUserForm!: FormGroup;
  private currentIndex = 0;
  public modalSpin = false;
  @ViewChild('users') input!: ElementRef; 

  constructor(
    private dbService: DatabaseService,
    private emitService: EmitService
  ) { 
    this.searchUserForm = new FormGroup({
      userLogin : new FormControl('')
    });
    this.modalSpin = true;
    this.subscr = this.dbService.getUsersDatas().subscribe(users => {
      if(!this.usersAdmin.length) {
        users.forEach((user, index) => {
          this.usersAdmin[index] = new UserAdminModel(
            user.userId, user.userNickname, user.userLogin,
            null, null, null, user.userBlocked
          );
        });
      };
      if(!this.subscr2) {
        this.subscr2 = from(users).pipe(
        mergeMap((user: UserModel) => this.dbService.getUserOrders(user.userId)),
        take(users.length),
        finalize(() => {
          this.modalSpin = false;
          this.scrollToIndex(this.currentIndex);
          this.emitService.saveIndex(-1);
          this.subscr2.unsubscribe();
        })
      ).subscribe(order => {
        let userOrder!: UserOrderModel;
        if(order.length) {
          userOrder = order.sort((a, b) => Number(b.orderId) - Number(a.orderId))[0];
          const index = this.usersAdmin.map(user => user.userId).indexOf(userOrder.userId);
          this.usersAdmin[index].userEmailWait = !userOrder.sentEmail;
          this.usersAdmin[index].userReceiveWait = !userOrder.received;
          this.usersAdmin[index].userReturneWait = !userOrder.returned;
        };
      });
      }
    });
  }

  getStyle(index: number) {
    if(index == this.currentIndex) {
      return {'background-color': 'rgba(240, 238, 238, 0.3)'};
    } else {
      return null;
    };
  }
  
  getStyleUsers(value: number): any {
    const height = document.documentElement.clientHeight;
    const width = document.documentElement.clientWidth;
    let heightValue = height - 51 - value * 2;
    heightValue = heightValue - 155;
    let widthValue = width - value * 2;
    widthValue > 1300 ? widthValue = 1300 : true;
    return {
      'height':heightValue.toString() + 'px',
      'width':widthValue.toString() + 'px',
      'overflow-y': 'auto'
    };
  }
  
  blockUserId(userId: string, index: number) {
    this.currentIndex = index;
    this.usersAdmin[index].userBlocked = !this.usersAdmin[index].userBlocked;
    this.subscr3 = this.dbService.updateUserBlocked(userId, this.usersAdmin[index].userBlocked as boolean).subscribe(() => {
      this.subscr3.unsubscribe();
    });
  }
  
  saveUserId(userId: string, linkBack: string, index: number) {
    this.currentIndex = index;
    this.emitService.saveUserId(userId);
    this.emitService.saveIndex(this.currentIndex);
    this.emitService.saveLinkBackUsers(linkBack);
  }
  
  onSubmit() {
    const userLogin = this.searchUserForm.get('userLogin')?.value;
    if(userLogin) {
      const index = this.usersAdmin.map(user => user.userEmail).indexOf(userLogin);
      if(index >= 0) {
       this.scrollToIndex(index); 
      };
    };
  }  
  
  scrollToIndex(index: number) {
    this.input.nativeElement.scrollTop = 0;
    this.input.nativeElement.scrollTop += 50 * index;
    this.currentIndex = index;
  }
  
  ngOnInit(): void {
    const index = this.emitService.getIndex();
    if(index >= 0) {
      this.currentIndex = index;
    }
  }
  
  ngOnDestroy() {
    if(this.subscr) {
      this.subscr.unsubscribe();
    };
    if(this.subscr2) {
      this.subscr2.unsubscribe();
    };
    if(this.subscr3) {
      this.subscr3.unsubscribe();
    };
  }
}
