import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLeasesComponent } from './list-leases.component';

describe('ListLeasesComponent', () => {
  let component: ListLeasesComponent;
  let fixture: ComponentFixture<ListLeasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListLeasesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLeasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
