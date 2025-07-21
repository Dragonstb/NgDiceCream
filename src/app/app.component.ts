import { Component, viewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { DicePoolComponent } from './dice-pool.component';

@Component({
    selector: 'app-root',
    imports: [DicePoolComponent, ReactiveFormsModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.less'
})
export class AppComponent {
    title = 'NgDiceCream';
    pool = viewChild.required(DicePoolComponent);
    total: number = 0;
    poolDescriptor: string = "1d6";
  
    addHeapForm = new FormGroup({
        count: new FormControl(1, [Validators.required, Validators.min(1)]),
        facets: new FormControl(6, [Validators.required, Validators.min(1)])
    })
  
    /** Adds a heap of dice according to the values in the add-heap-form.
     */
    addHeap() {
        let count = this.addHeapForm.value.count;
        let facets = this.addHeapForm.value.facets;
        if( count && facets ) {
            this.pool().addHeap(count, facets);
        }
    }
  
    /** Rolls all dice of all heaps.
     */
    rollAllDice() {
        this.total = this.pool().rollAllDice();
    }

    /** Reaction when a single heap was rolled, instead of all dice.
     * 
     * @param total Result of the roll.
     */
    singleHeapWasRolled(total: number) {
        // do not announce the total of all heaps
        this.total = total;
    }

    /** Reaction when the pool changes.
     */
    consumeHeapChangedEvent() {
        // TODO: new heap component has not been created when this method fires.
        setTimeout( () => {
            this.poolDescriptor = this.pool().gatherHeapDescriptions();
        } );
    }
}
