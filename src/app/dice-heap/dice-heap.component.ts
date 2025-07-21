import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'dice-heap',
    templateUrl: './dice-heap.component.html',
    standalone: true
})
export class DiceHeapComponent {
    @Input() facets:number = 6;
    @Output() removeHeapEvent = new EventEmitter<number>();
    @Output() rollSingleHeapEvent = new EventEmitter<number>();
    @Output() heapChangedEvent = new EventEmitter();

    /** Number of dice in this heap. */
    count:number = 1;
    /** Number of facets the dice in this heap have. */
    total:number = 0;
    /** A string listing the outcome of each individual die. */
    outcome:string = "";

    /** Adds the given number of dice to the heap. Negative numbers actually remove
     * dice from the heap, but one die always remains.
     * 
     * A heapCHangedEvent is emitted in case the invokation of this method has
     * actually changed the number of the dice in this heap.
     * 
     * @param count Number of dice to be added.
     */
    addDice(count:number) {
        const oldCount = this.count;
        this.count = Math.max( 1, this.count + count );

        if (this.count !== oldCount) {
            this.heapChangedEvent.emit();
        }
    }

    /** Rolls the dice of the heap and updates the displays of the heap.
     * 
     * @returns Total of the rolls of this heap.
     */
    rollDice() {
        // add randomness by skipping some out
        const skips: number = Date.now() % 4;
        for (let idx = 0; idx < skips; idx++) {
            Math.random();
        }

        let arr = [];
        let rollTotal = 0;
        let roll;
        for (let idx = 0; idx < this.count; idx++) {
            roll = 1 + Math.floor( Math.random()*(this.facets-1) );
            arr.push(roll);
            rollTotal += roll;
        }
        this.total = rollTotal;
        this.outcome = arr.join(", ");
        return rollTotal;
    }

    /** Rolls the dice of the heap and emits a singleHeapWasRolled event.
     * 
     * The event is emitted because it bubbles the result of the roll upwards
     * to the main component. There, the result is also displayed in the main
     * result area. The main result area is an aria-live area, other than the
     * result area of the heap. Consequently, the event eventually causes the
     * assistive technologies to announce the result of the roll.
     */
    rollDiceOfHeap() {        
        this.rollDice();
        this.rollSingleHeapEvent.emit(this.total);
    }

    /** Emits a "I want to be removed" event.
     */
    removeHeap() {
        this.removeHeapEvent.emit(this.facets);
    }

    /** Gets the description of the heap, like '2d6'.
     * 
     * @returns Heap descriptor.
     */
    getHeapDescription() {
        return String( this.count + 'd' + this.facets );
    }

    ngAfterViewInit() {
        this.heapChangedEvent.emit();
    }
}