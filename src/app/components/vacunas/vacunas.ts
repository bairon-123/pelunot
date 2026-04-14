import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-vacunas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './vacunas.html',
  styleUrl: './vacunas.scss'
})
export class VacunasComponent { }