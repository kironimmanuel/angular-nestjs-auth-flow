import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './dialog.component';
describe('DialogComponent', () => {
    let component: DialogComponent;
    let fixture: ComponentFixture<DialogComponent>;
    const mockDialogData = {
        title: 'Test Title',
        message: 'Test Message',
        actions: [
            { text: 'Action 1', callback: () => console.log('Action 1 executed') },
            { text: 'Action 2', callback: () => console.log('Action 2 executed') },
        ],
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DialogComponent, MatDialogModule, NoopAnimationsModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
                { provide: MatDialogRef, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have the correct dialog data', () => {
        console.log(component.data);
        expect(component.data).toEqual(mockDialogData);
    });
});
