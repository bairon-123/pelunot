import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaMascotaComponent } from './vista-mascota';

describe('VistaMascota', () => {
  let component: VistaMascotaComponent;
  let fixture: ComponentFixture<VistaMascotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaMascotaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VistaMascotaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
