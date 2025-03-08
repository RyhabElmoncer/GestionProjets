import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeasesComponent } from './create-leases.component';

describe('CreateLeasesComponent', () => {
  let component: CreateLeasesComponent;
  let fixture: ComponentFixture<CreateLeasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLeasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLeasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
