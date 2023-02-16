import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { IdentityValidation } from './identity.validation';

@Directive({
  selector: '[appIdentityValidation]',
  providers: [{provide: NG_VALIDATORS, useExisting: IdentityValidationDirective, multi: true}]
})
export class IdentityValidationDirective implements Validator {

  validate(control: AbstractControl): ValidationErrors | null {
    return IdentityValidation(control);
  }

}
