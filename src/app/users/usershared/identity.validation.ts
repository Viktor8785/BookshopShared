import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const IdentityValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
            const password = control.get('userPassword');
            const confirmPassword = control.get('userConfirmPassword');
            return password?.value === confirmPassword?.value ? null : {confirmPassword: {value: control.value}}
}
