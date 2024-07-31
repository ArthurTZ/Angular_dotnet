import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Pessoa } from './models/pessoa';
import { AsyncPipe, JsonPipe, NgFor, NgForOf, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, AsyncPipe, NgFor, NgIf, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'FullApi';
  // http = inject(HttpClient);
  urlApi = 'https://localhost:7205'
  // List Pessoa
  pessoas$? : Observable<Pessoa[]>;

  // Search Pessoa
  pessoaEncontrada$? : Observable<Pessoa>;
  valorBuscarPessoa = '';

  // Insert Pessoa
  insertNome = '';

  // Update Pessoa
  updateId = '';
  updateNome = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.GetPessoas();
  }
  
  
  GetPessoas() : void
  {
    this. pessoas$ = this.http.get<Pessoa[]>(`${this.urlApi}/pessoa`)
  }

  getPessoaEspecifica() {
    if (!this.valorBuscarPessoa) {
      return;
    }

    this.pessoaEncontrada$ = this.http.get<Pessoa>(`${this.urlApi}/pessoas/${this.valorBuscarPessoa}`)
  }

  addPessoa(){

    if (!this.insertNome) {
      return;
    }

    const pessoaCriar : Pessoa = {
      id: '9b85c869-0482-48d5-b8f4-f06f27296297',
      nome : this.insertNome,
    }

    this.http.post<void>(`${this.urlApi}/pessoas`, pessoaCriar)
    .subscribe(_ => this.GetPessoas());
  }

  updatePessoa(pessoa : Pessoa){
    console.log(pessoa)

    this.updateId = pessoa.id;
    this.updateNome = pessoa.nome;
  }

  UpdateNome(){
    if (!this.updateNome || !this.updateId) {
      return;
    }
    const pessoa : Pessoa = {
      id: this.updateId,
      nome : this.updateNome
    };
    const url = `${this.urlApi}/pessoas/${this.updateId}`

    this.http.put<Pessoa>(url, pessoa).subscribe(_ => {
      this.GetPessoas()
      this.updateNome = '';
    })
  }



}
