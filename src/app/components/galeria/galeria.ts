import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './galeria.html',
  styleUrl: './galeria.scss'
})
export class GaleriaComponent { }