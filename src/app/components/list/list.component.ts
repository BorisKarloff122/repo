import {Component, OnInit } from '@angular/core';
import {INote} from "../../models/note";
import {FormComponent} from "../form/form.component";
import {MatDialog} from "@angular/material/dialog";
import {GetDataService} from "../../services/get-data.service";
import {mergeMap, Observable, switchMap, tap} from "rxjs";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent implements OnInit {
  public notes: INote[] = [];
  public initialNotes: INote[] = [];
  public categories: Observable<string[]> = this.dataService.onNoteCreateSource.pipe(
    switchMap(() => {
      return this.dataService.getAllCategories();
    })
  )
  public searchField: FormControl = new FormControl('');
  public dialogData: INote = {
    dueDate: '',
    note:'',
    category: '',
  };

  constructor(
    private dialog: MatDialog,
    private dataService: GetDataService
  ) { }

  ngOnInit(): void {
    this.getAllNotes();
    this.search();
  }

  public search(): any{
    this.searchField.valueChanges.subscribe((res)=>{
        if(res.length > 0){
          this.notes = this.initialNotes.filter(el => el.note.indexOf(res) !== -1);
        } else {
          this.notes = this.initialNotes;
        }
      }
    )
  }

  public filterCategories(value: string): void{
    this.notes = this.initialNotes.filter(el => el.category === value);
  }

  public getAllNotes(): void{
    this.dataService.getAllNotes().subscribe((res)=>{
      this.notes = res;
      this.initialNotes = res;
    })
  }

  public editNote(id: string | undefined, note: INote): void{
    this.dialog.open(FormComponent, {data: note}).afterClosed().pipe(
        mergeMap((res) => { return this.dataService.updateNote(id, res.data); }),
        tap(() => {
          this.dataService.onNoteCreateSource.next('');
          this.getAllNotes()
        } )
    ).subscribe()
  }

  public deleteNote(id: string | undefined): void{
    this.dataService.deleteNote(id).subscribe((res)=>{
      this.getAllNotes();
    })
  }

  public newNote(): void{
    this.dialog.open(FormComponent, {data: this.dialogData}).afterClosed().pipe(
      mergeMap((res) =>{ return this.dataService.createNote(res.data) }),
      tap(()=> {
        this.dataService.onNoteCreateSource.next('');
        this.getAllNotes()
      } )
    ).subscribe()
  }


}
