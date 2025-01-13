import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    const hostname = window.location.hostname; // Obtém o hostname
    const domainParts = hostname.split('.');

    console.log(hostname, 'hostname')
    console.log(domainParts, 'domainParts')
    if (domainParts.length > 2) {
      // Caso seja um subdomínio
      const subdomain = domainParts[0];
      // Você pode adicionar alguma lógica aqui para verificar o subdomínio
      // Exemplo: redirecionar para a página baseada no subdomínio
      this.router.navigate([`/paginas/visualizar/${subdomain}`]);
    } 
  }
}
