import {Component, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-search-field',
  templateUrl: './search-field.component.html',
  styleUrls: ['./search-field.component.sass'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchFieldComponent),
      multi: true,
    }
  ]
})
export class SearchFieldComponent {

  public val: string = '';

  public onChange: any = () => {
  };
  public onTouch: any = () => {
  };

  set value(val: string) {
    this.val = val;
    this.onChange(val);
    this.onTouch(val);
  }

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

}
