import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOwnerComponent } from './list-owner.component';

describe('ListOwnerComponent', () => {
  let component: ListOwnerComponent;
  let fixture: ComponentFixture<ListOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
