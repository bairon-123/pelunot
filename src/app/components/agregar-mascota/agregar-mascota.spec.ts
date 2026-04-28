import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarMascota } from './agregar-mascota';

describe('AgregarMascota', () => {
  let component: AgregarMascota;
  let fixture: ComponentFixture<AgregarMascota>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarMascota],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarMascota);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
