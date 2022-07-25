import {Component, OnInit} from '@angular/core';
import {INote} from "../../models/note";
import {FormComponent} from "../form/form.component";
import {MatDialog} from "@angular/material/dialog";
import {GetDataService} from "../../services/get-data.service";
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  lastValueFrom,
  mergeMap,
  Observable,
  startWith,
  switchMap,
  tap
} from "rxjs";
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.sass']
})
export class ListComponent {
  public form = new FormGroup({
    category: new FormControl(''),
    search: new FormControl('')
  })

  public dialogData: INote = {
    dueDate: '',
    note: '',
    category: '',
  };

  public search$: Observable<string> | undefined = this.searchFieldSource?.valueChanges.pipe(
    startWith(''),
    debounceTime(400),
    distinctUntilChanged()
  );
  public category$: Observable<string> | undefined = this.categorySource?.valueChanges.pipe(
    startWith(''),
    distinctUntilChanged()
  );

  public notes$: Observable<INote[]> = combineLatest([
    this.search$ as Observable<string>,
    this.category$ as Observable<string>,
    this.dataService.onNoteCreateSource
  ]).pipe(
    switchMap(([searchText, category]) => {
      return this.dataService.getAllNotes(searchText, category)
    })
  )
  public categories$: Observable<string[]> = this.dataService.onNoteCreateSource.pipe(
    switchMap(() => {
      return this.dataService.getAllCategories();
    })
  )

  constructor(
    private dialog: MatDialog,
    private dataService: GetDataService
  ) {}

  public get searchFieldSource(): AbstractControl | null {
    return this.form.get('search')
  }

  public get categorySource(): AbstractControl | null {
    return this.form.get('category')
  }

  public async editNote(id: string | undefined, note: INote): Promise<void> {
    const result = this.dialog.open(FormComponent, {data: note}).afterClosed().pipe(
      mergeMap((res) => {
        return this.dataService.updateNote(id, res.data);
      }),
      tap(() => {
        this.dataService.onNoteCreateSource.next('');
      })
    )
    await lastValueFrom(result);
  }

  public async deleteNote(id: string | undefined): Promise<void> {
    const result = this.dataService.deleteNote(id).pipe(
      tap(() => this.dataService.onNoteCreateSource.next(''))
    )

    await lastValueFrom(result);
  }

  public async newNote(): Promise<void> {
    const result = this.dialog.open(FormComponent, {data: this.dialogData}).afterClosed().pipe(
      mergeMap((res) => {
        return this.dataService.createNote(res.data)
      }),
      tap(() => {
        this.dataService.onNoteCreateSource.next('');
      })
    )

    await lastValueFrom(result);
  }


}
