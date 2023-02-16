import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { IdentityValidation } from './identity.validation';

@Directive({
  selector: '[appIdentityValidation2]',
  providers: [{provide: NG_VALIDATORS, useExisting: IdentityValidationDirective2, multi: true}]
})
export class IdentityValidationDirective2 implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    return IdentityValidation(control);
  }
}
