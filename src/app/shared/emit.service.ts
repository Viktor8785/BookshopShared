import {EventEmitter} from '@angular/core';
import { Injectable } from "@angular/core";
import { EventData } from './event.model';

@Injectable({
  providedIn: 'root'
})
export class EmitService {
  data: EventEmitter<EventData> = new EventEmitter(true);
  error: EventEmitter<string> = new EventEmitter(true);
  signIn: EventEmitter<string> = new EventEmitter(true);
  createUser: EventEmitter<string> = new EventEmitter(true);
  sendSignInEmail: EventEmitter<string> = new EventEmitter(true);
  signOut: EventEmitter<string> = new EventEmitter(true);
  sendCodeEmail: EventEmitter<string> = new EventEmitter(true);
  sendResetPasswordEmail: EventEmitter<string> = new EventEmitter(true);
  updatePassword: EventEmitter<string> = new EventEmitter(true);
  updateEmail: EventEmitter<string> = new EventEmitter(true);
  showButtonMakeOrder: EventEmitter<string> = new EventEmitter(true);
  authState: EventEmitter<string> = new EventEmitter(true);
  adminUserDetail: EventEmitter<boolean> = new EventEmitter(true);
  bookshelfCurrentOffset: EventEmitter<number> = new EventEmitter(true);
  bookshelfCurrentPage: EventEmitter<number> = new EventEmitter(true);
  bookshelfTotalPages: EventEmitter<number> = new EventEmitter(true);
  bookshelfTotalDataLength: EventEmitter<number> = new EventEmitter(true);
  linkBack: null|string = null;
  linkBackUsers: null|string = null;
  errorMessage: string = 'Please, close this message.';
  errorMessColor = '';
  userId!: string;
  orderId!: string;
  selectedUserBookedBooksPage!: number;
  selectedUserBooksPage!: number;
  selectedPage!: number;
  totalDataLength!: number;
  totalPages!: number;
  offset!: number;
  index = -1;
  
    
  emitShowButtonMakeOrder(value: string) {
    this.showButtonMakeOrder.emit(value);
  }
  
  getShowButtonMakeOrder() {
    return this.showButtonMakeOrder;
  }
  
  emitBookshelfCurrentOffset(value: number) {
    this.bookshelfCurrentOffset.emit(value);
  }
  
  getBookshelfCurrentOffset() {
    return this.bookshelfCurrentOffset;
  }

  emitBookshelfCurrentPage(value: number) {
    this.bookshelfCurrentPage.emit(value);
  }
  
  getBookshelfCurrentPage() {
    return this.bookshelfCurrentPage;
  }
  
  emitBookshelfTotalPages(value: number) {
    this.bookshelfTotalPages.emit(value);
  }
  
  getBookshelfTotalPages() {
    return this.bookshelfTotalPages;
  }
  
  emitBookshelfTotalDataLength(value: number) {
    this.bookshelfTotalDataLength.emit(value);
  }
  
  getBookshelfTotalDataLength() {
    return this.bookshelfTotalDataLength;
  }

  getErrorMessColor() {
    return this.errorMessColor;
  }

  saveErrorMessColor(value: string) {
    this.errorMessColor = value;
  }

  saveLinkBackUsers(value: null|string) {
    this.linkBackUsers = value;
  }
  
  getLinkBackUsers() {
    return this.linkBackUsers;
  }
  
  saveLinkBack(value: null|string) {
    this.linkBack = value;
  }
  
  getLinkBack() {
    return this.linkBack;
  }

  saveErrorMessage(value: string) {
    this.errorMessage = value;
  }
  
  getErrorMessage() {
    return this.errorMessage;
  }
  
  saveIndex(value: number) {
    this.index = value;
  }
  
  getIndex() {
    return this.index;
  }
  
  saveOrderId(value: string) {
    this.orderId = value;
  }
  
  getOrderId() {
    return this.orderId;
  }
  saveUserId(value: string) {
    this.userId = value;
  }
  
  getUserId() {
    return this.userId;
  }

  emitAdminUserDetail(value: boolean) {
    this.adminUserDetail.emit(value);
  }
  
  getAdminUserDetail() {
    return this.adminUserDetail;
  }
  
  emitAuthState(value: string) {
    this.authState.emit(value);
  }
  
  getAuthState() {
    return this.authState;
  }
  
  emitUpdateEmail(value: string) {
    this.updateEmail.emit(value);
  }
  
  getUpdateEmail() {
    return this.updateEmail;
  }
  
  emitUpdatePassword(value: string) {
    this.updatePassword.emit(value);
  }
  
  getUpdatePassword() {
    return this.updatePassword;
  }
  
  emitSendResetPasswordEmail(value: string) {
    this.sendResetPasswordEmail.emit(value);
  }
  
  getSendResetPasswordEmail() {
    return this.sendResetPasswordEmail;
  }
  
  emitSendCodeEmail(value: string) {
    this.signIn.emit(value);
  }
  
  getSendCodeEmail() {
    return this.signIn;
  }
  
  emitSignInCode(value: string) {
    this.signIn.emit(value);
  }
  
  getSignInCode() {
    return this.signIn;
  }

  emitSendSignInEmail(value: string) {
    this.sendSignInEmail.emit(value);
  }
  
  getSendSignInEmail() {
    return this.sendSignInEmail;
  }

  emitCreateUser(value: string) {
    this.createUser.emit(value);
  }
  
  getCreateUser() {
    return this.createUser;
  }

  emitEvent(value: EventData) {
    this.data.emit(value);
  }
  
  getEmitter() {
    return this.data;
  }

  emitError(value: string) {
    this.error.emit(value);
  }

  getError() {
    return this.error;
  }

  saveData(selectedPage: number, totalPages: number, offset: number, totalDataLength: number): void {
    this.selectedPage = selectedPage;
    this.totalPages = totalPages;
    this.offset = offset;
    this.totalDataLength = totalDataLength;
  }

  saveUserBookedBooksData(selectedPage: number): void {
    this.selectedUserBookedBooksPage = selectedPage;
  }
  
  getUserBookedBooksSelectedPage(): number {
    return this.selectedUserBookedBooksPage;
  }
  
  saveUserBooksData(selectedPage: number): void {
    this.selectedUserBooksPage = selectedPage;
  }
  
  getUserBooksSelectedPage(): number {
    return this.selectedUserBooksPage;
  }
  
  getSelectedPage(): number {
    return this.selectedPage;
  }
  getTotalPages(): number {
    return this.totalPages;
  }
  getOffset(): number {
    return this.offset;
  }
  getTotalDataLength(): number {
    return this.totalDataLength;
  }
}
