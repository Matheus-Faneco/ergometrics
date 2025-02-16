import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
  ) { }

  ngOnInit() {
    this.http.get('http://127.0.0.1:8000/api/usuario/', {withCredentials: true}).subscribe(
      res => {console.log(res)},
      err => {
        console.log(err);
      }
    )
  }
}
