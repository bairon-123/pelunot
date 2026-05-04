import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MascotasComponent } from './mascota';

describe('Mascota', () => {
  let component: MascotasComponent;
  let fixture: ComponentFixture<MascotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // 3. Cambia la importación del componente standalone
      imports: [MascotasComponent],
    }).compileComponents();

    // 4. Crea el componente correcto
    fixture = TestBed.createComponent(MascotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Es mejor usar detectChanges() aquí
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

