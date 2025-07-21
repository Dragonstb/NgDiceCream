import { Component, viewChildren, EventEmitter, Output } from "@angular/core";
import { DiceHeapComponent } from "./dice-heap/dice-heap.component";

@Component({
    selector: 'dice-pool',
    templateUrl: './dice-pool.component.html',
    imports: [DiceHeapComponent]
})
export class DicePoolComponent {
    /** For what kind of dice we have heaps. */
    heaps: number[] = [6];
    /** The heap components managed by this pool component. */
    children = viewChildren<DiceHeapComponent>(DiceHeapComponent);
    /** Event invoked in case a single heap is rolled instead of all heaps. Used to
     * notify the parent components. */
    @Output() rollSingleHeapEvent = new EventEmitter<number>();
    /** Event invokes when any heap of the pool changes. */
    @Output() heapChangedEvent = new EventEmitter();

    /** Adds a new heap of dice with the given number of facets. If the heap
     * already exists, the dice are added to the heap.
     * 
     * @param count Number of dice to be added.
     * @param facets Number of facets each die in the heap will have.
     */
    addHeap(count: number, facets: number) {
        let effectiveCount = count;
        if( !this.heaps.includes(facets) ) {
            this.heaps.push(facets);
            this.heaps.sort( (x,y) => x-y );
            // new heap starts with one die anyway
            effectiveCount = count - 1;
        }

        setTimeout( () => {
            this.addDiceToHeap( effectiveCount, facets );
        } );
    }
    
    /** Adds a given amount of dice to a heap of a certain type of dice.
     * 
     * @param count Number of dice to be added.
     * @param facets Number of facets the dice have.
     */
    addDiceToHeap(count: number, facets: number) {
        if (count === 0) {
            return;
        }

        const child = this.children().find( child => child.facets === facets );
        if ( child ) {
            child.addDice( count );
        }
        else {
            console.log('error #1529');
        }
    }

    /** Removes a heap of a certain type of dice.
     * 
     * @param facets Number of facets the dice in the heap have.
     */
    removeHeap(facets: number) {
        if( this.heaps.length > 1 && this.heaps.includes(facets) ) {
            let index = this.heaps.indexOf(facets);
            this.heaps.splice(index, 1);
            this.heapChangedEvent.emit();
        }
    }

    /** Rolls all dice of all heaps.
     * 
     * @returns The total of all rolls.
     */
    rollAllDice() {
        let rollTotal:number = 0;
        this.children().forEach(heap => {
            rollTotal += heap.rollDice();
        });
        return rollTotal;
    }

    /** Gets a description of all heaps, like '2d6+1d10+3d12'.
     * 
     * @returns Descriptor for the pool.
     */
    gatherHeapDescriptions() {
        let arr:string[] = [];
        this.children().forEach( heap => {
            arr.push( heap.getHeapDescription() );
        });
        return arr.join("+");
    }

    /** Reaction on event that a single heap was rolled, not all
     * dice in all heaps.
     * 
     * @param total Result of the roll.
     */
    singleHeapWasRolled(total: number) {
        this.rollSingleHeapEvent.emit(total);
    }

    bubbleHeapChangedEvent() {
        this.heapChangedEvent.emit();
    }
}