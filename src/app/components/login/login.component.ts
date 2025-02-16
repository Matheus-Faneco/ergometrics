import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      matricula: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      password: ['', [Validators.required]],
    });
  }

  submit() {
    if (this.form.invalid) {
      console.error('Formulário inválido');
      return;
    }

    this.http.post(
      'http://127.0.0.1:8000/login',
      this.form.getRawValue(),
      { withCredentials: true }
    ).subscribe({
      next: () => this.router.navigate(['home']),
      error: (err) => console.error('Erro no login:', err),
    });
  }
}
