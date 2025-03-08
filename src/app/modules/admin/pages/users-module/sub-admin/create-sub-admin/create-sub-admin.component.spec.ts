import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubAdminComponent } from './create-sub-admin.component';

describe('CreateSubAdminComponent', () => {
  let component: CreateSubAdminComponent;
  let fixture: ComponentFixture<CreateSubAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
