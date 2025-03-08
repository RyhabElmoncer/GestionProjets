import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubAdminComponent } from './list-sub-admin.component';

describe('ListSubAdminComponent', () => {
  let component: ListSubAdminComponent;
  let fixture: ComponentFixture<ListSubAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListSubAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListSubAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
