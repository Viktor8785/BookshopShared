import { AbstractControl, ValidationErrors } from "@angular/forms"

export class EmailValidation {
    static isValid(): any {
        return (control: AbstractControl): ValidationErrors | null => {
            //const regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])"); 
            const regex = new RegExp('[a-zA-Z0-9\._\-]+@[a-z]+\\.[a-z]{2,3}');
            const isValid = regex.test(control.value);
            return isValid ? null : {userLogin: {value: control.value}};
        }
    }
}
