/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BoardModalComponent } from './board-modal.component';

describe('BoardModalComponent', () => {
  let component: BoardModalComponent;
  let fixture: ComponentFixture<BoardModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
