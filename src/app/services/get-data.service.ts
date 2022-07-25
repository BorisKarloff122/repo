import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {INote} from "../models/note";

@Injectable({
  providedIn: 'root'
})
export class GetDataService {

  public onNoteCreateSource = new BehaviorSubject('');

  constructor(private http: HttpClient) {
  }

  public getAllNotes(search: string, category: string): Observable<INote[]> {
    return this.http.get<INote[]>(`http://localhost:3000/api/notes?search=${search}&category=${category}`);
  }

  public updateNote(id: string | undefined, reqBody: INote): Observable<INote> {
    return this.http.put<INote>(`'http://localhost:3000/api/notes/${id}`, reqBody)
  }

  public deleteNote(id: string | undefined): Observable<INote> {
    return this.http.delete<INote>(`${'http://localhost:3000/api/notes/' + id}`)
  }

  public createNote(reqBody: INote): Observable<INote> {
    return this.http.post<INote>('http://localhost:3000/api/notes', reqBody)
  }

  public getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>('http://localhost:3000/api/categories');
  }

}
