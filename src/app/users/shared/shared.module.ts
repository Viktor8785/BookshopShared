import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShrinkTextPipe } from './shrink-text.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DialogComponent } from './dialog/dialog.component';
@NgModule({
  declarations: [
    ShrinkTextPipe,
    DialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  exports: [
    ShrinkTextPipe,
    DialogComponent
  ]
})
export class SharedModule { }
