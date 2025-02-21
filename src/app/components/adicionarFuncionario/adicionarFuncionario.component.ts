import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FuncionarioService} from '../../core/services/funcionario.service';

@Component({
  selector: 'app-adicionarFuncionario',
  templateUrl: './adicionarFuncionario.component.html',
  styleUrl: './adicionarFuncionario.component.css'
})
export class AdicionarFuncionarioComponent implements OnInit {
  formularioFuncionario!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private FuncionarioService: FuncionarioService
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  private inicializarFormulario(): void {
    this.formularioFuncionario = this.fb.group({
      nome: ['', Validators.required],
      matricula: ['', [Validators.required]],
      cargo: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.formularioFuncionario.valid) {
      const employeeData = this.formularioFuncionario.value;
      this.FuncionarioService.adicionarFuncionario(employeeData).subscribe({
        next: (response) => {
          console.log('Funcionário adicionado com sucesso:', response);
          this.formularioFuncionario.reset();
        },
        error: (error) => {
          console.error('Erro ao adicionar funcionário:', error);
        }
      });
    }
  }
}
