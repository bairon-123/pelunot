import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarMascotaComponent } from './agregar-mascota';

describe('AgregarMascota', () => {
  let component: AgregarMascotaComponent;
  let fixture: ComponentFixture<AgregarMascotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarMascotaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarMascotaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
