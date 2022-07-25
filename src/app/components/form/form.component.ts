import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material/dialog";
import {INote} from "../../models/note";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.sass']
})
export class FormComponent implements OnInit{
  public editMode: boolean = false;

  constructor(private dialog: MatDialogRef<FormComponent>,
              @Inject(MAT_DIALOG_DATA) public data: INote){}

  ngOnInit() {
    this.checkIfEdit();
  }

  public checkIfEdit(): void{
      this.editMode = this.data.note !== '';
  }

  public notesForm = new FormGroup({
    note: new FormControl(this.data.note, [Validators.required, Validators.minLength(4)]),
    dueDate: new FormControl(this.data.dueDate, Validators.required),
    category: new FormControl(this.data.category, Validators.required)
  });

  public formSubmit(): void{
    if(this.notesForm.valid){
      this.dialog.close({data: this.notesForm.value});
    }
  }

  public getFormControl(name: string): AbstractControl{
    return this.notesForm.get(name) as AbstractControl
  }


}
