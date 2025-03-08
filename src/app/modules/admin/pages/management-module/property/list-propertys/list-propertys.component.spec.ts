import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPropertysComponent } from './list-propertys.component';

describe('ListPropertysComponent', () => {
  let component: ListPropertysComponent;
  let fixture: ComponentFixture<ListPropertysComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListPropertysComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListPropertysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
